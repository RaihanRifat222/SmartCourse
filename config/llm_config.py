from dotenv import load_dotenv
import os

load_dotenv()

llm_config = {
    "model": "gpt-4o-mini",
    "api_key": os.getenv("OPENAI_API_KEY"),
    "temperature": 0,
    "response_format": {"type": "json_object"},
}
