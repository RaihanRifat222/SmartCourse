import json
import os
from agents.user_proxy import user_proxy
from agents.curriculum_architect import curriculum_architect
from agents.curriculum_validator import curriculum_validator
from agents.module_content_author import module_content_author
from utils.schema_validator import validate_json
from utils.json_cleaner import extract_json

def generate_course(learning_request: dict):



    MAX_RETRIES = 3
    
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
            os.makedirs("output", exist_ok=True)
            with open("output/curriculum.json", "w") as f:
                json.dump(curriculum_json, f, indent=2)
            print("Curriculum saved to output/curriculum.json")

            break   
        print("Curriculum needs revision. Issues found:")
        issues = validation_json["validation"]["issues"]

    else:
        raise RuntimeError("Curriculum could not be approved after max retries")

    with open("output/curriculum.json", "r") as f:
        saved_curriculum = json.load(f)

    modules = saved_curriculum["curriculum"]["modules"]

    print("\n=== Generating content for each module ===\n")

    os.makedirs("output/modules", exist_ok=True)
    all_module_contents = {}
    for i, module in enumerate(modules):
        print(f"Generating content for module {i+1}/{len(modules)}: {module['title']}")

        module_prompt = f"""Overall learning request:
        {learning_request}

        This is the curriculum module you MUST focus on:
        {module}

        Remember to follow instructions and return ONLY the JSON matching the schema.
        """

        user_proxy.initiate_chat(
            module_content_author,
            message=module_prompt,
            max_turns=1
        )

        raw_module_content = module_content_author.last_message()["content"]
        clean_module_json_text = extract_json(raw_module_content)
        module_content_json = json.loads(clean_module_json_text)
        validate_json(module_content_json, "module_content.json")

        with open(f"output/modules/{module['module_id']}_content.json", "w") as f:
            json.dump(module_content_json, f, indent=2)

        print(f"Content for module '{module['title']}' saved to output/modules/{module['module_id']}_content.json\n")
        all_module_contents[module["module_id"]] = module_content_json

    return{
        "curriculum": curriculum_json,
        "module_contents": all_module_contents
    }