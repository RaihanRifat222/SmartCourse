from autogen import AssistantAgent
from config.llm_config import llm_config

curriculum_validator = AssistantAgent(
    name="CurriculumValidator",
    system_message=(
        "You are an enterprise curriculum validator.\n"
        "Your job is to check the curriculum ONLY against the explicit learning request.\n\n"

        "You MUST return ONLY a JSON object matching this schema:\n"
        "{\n"
        "  \"validation\": {\n"
        "    \"status\": \"approved\" | \"revise\",\n"
        "    \"issues\": [\n"
        "      {\n"
        "        \"type\": \"string\",\n"
        "        \"description\": \"string\",\n"
        "        \"severity\": \"low\" | \"medium\" | \"high\"\n"
        "      }\n"
        "    ]\n"
        "  }\n"
        "}\n\n"

        "Validation rules (STRICT):\n"
        "1. Total duration (sum of duration_minutes) MUST equal constraints.duration_hours * 60.\n"
        "2. Each learning_goal MUST be addressed by at least one module learning_objective.\n"
        "3. Content MUST remain conceptual (no coding, math, implementation details).\n"
        "4. DO NOT introduce new criteria or subjective opinions.\n"
        "5. If all rules pass, status MUST be \"approved\".\n"
        "6. If any rule fails, status MUST be \"revise\" and issues MUST reference the failed rule.\n\n"

        "Rules:\n"
        "- No markdown.\n"
        "- No extra fields.\n"
        "- First character '{', last character '}'."
    ),
    llm_config=llm_config
)
