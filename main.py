import json
from agents.user_proxy import user_proxy
from agents.curriculum_architect import curriculum_architect
from agents.curriculum_validator import curriculum_validator
from utils.schema_validator import validate_json
from utils.json_cleaner import extract_json
MAX_RETRIES = 3
learning_request = {
    "topic": "Introduction to Large Language Models",
    "audience": {
        "role": "Business analysts",
        "prior_knowledge": "Basic data literacy",
        "seniority": "Mid-level"
    },
    "learning_goals": [
        "Understand what LLMs are",
        "Identify enterprise use cases"
    ],
    "constraints": {
        "duration_hours": 4,
        "depth": "Conceptual",
        "tone": "Professional"
    }
}
issues = []
curriculum_json = None
for attempt in range(1, MAX_RETRIES+1):
    print(f"Attempt {attempt} to generate and validate curriculum")

    architect_prompt = f"Design a curriculum for this request:\n{learning_request}\n"

    if issues:
        architect_prompt += f"\nPrevious attempt had these issues:\n{issues}\n"

    user_proxy.initiate_chat(
        curriculum_architect,
        message=architect_prompt,
        max_turns=1
    )

    raw_output = curriculum_architect.last_message()["content"]
    clean_json_text = extract_json(raw_output)

    curriculum_json = json.loads(clean_json_text)
    validate_json(curriculum_json, "curriculum.json")

    # Validator

    user_proxy.initiate_chat(
        curriculum_validator,
        message=f"""Learning request:
        {learning_request}
        Curriculum:
        {curriculum_json}   
        """,
        max_turns=1
    )
    validation_raw = curriculum_validator.last_message()["content"]
    validation_json = json.loads(extract_json(validation_raw))
    validate_json(validation_json, "validation.json")
    status= validation_json["validation"]["status"]
    if status == "approved":
        print("Curriculum approved!")
        break   
    print("Curriculum needs revision. Issues found:")
    issues = validation_json["validation"]["issues"]

else:
    raise RuntimeError("Curriculum could not be approved after max retries")

