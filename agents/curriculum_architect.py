from autogen import AssistantAgent
from config.llm_config import llm_config

curriculum_architect = AssistantAgent(
    name = "CurriculumArchitect",
    system_message=(
        "Return ONLY a JSON object that matches this exact schema:\n"
        "{\n"
        "  \"curriculum\": {\n"
        "    \"modules\": [\n"
        "      {\n"
        "        \"module_id\": \"string\",\n"
        "        \"title\": \"string\",\n"
        "        \"duration_minutes\": number,\n"
        "        \"learning_objectives\": [\"string\"],\n"
        "        \"key_concepts\": [\"string\"]\n"
        "      }\n"
        "    ]\n"
        "  }\n"
        "}\n"
        "No extra fields. No markdown. First char '{' last char '}'."
    ),
    llm_config=llm_config
)
