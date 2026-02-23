from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import json
import os
import re
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from utils.schema_validator import validate_json
from agents.module_content_author import module_content_author
from agents.user_proxy import user_proxy
from course_engine import generate_course
from utils.json_cleaner import extract_json

app = FastAPI()

COURSE_DIR = "output/courses"
COURSE_PREFIX = "course_"


class CourseRequest(BaseModel):
    topic: str
    audience: Dict[str, Any]
    learning_goals: list[str]
    constraints: Dict[str, Any]
    custom_request: str | None = None


class RegenerateRequest(BaseModel):
    custom_request: str | None = None


# =========================
# Course Generation
# =========================

@app.post("/generate_course")
def generate_course_endpoint(request: CourseRequest):
    result = generate_course(request.dict())
    saved_course = save_course(result, request.dict())
    return saved_course


@app.get("/courses")
def list_courses():
    os.makedirs(COURSE_DIR, exist_ok=True)
    courses = []

    for filename in os.listdir(COURSE_DIR):
        if not filename.endswith(".json"):
            continue

        path = os.path.join(COURSE_DIR, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                courses.append(json.load(f))
        except json.JSONDecodeError:
            continue

    courses.sort(key=lambda c: c.get("created_at", ""), reverse=True)
    return courses


def save_course(course_data: dict, learning_request: dict):
    os.makedirs(COURSE_DIR, exist_ok=True)
    topic = learning_request.get("topic", "course")
    next_id = _next_course_id(topic)

    payload = {
        "id": next_id,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "learning_request": learning_request,
        "course": course_data,
    }

    path = os.path.join(COURSE_DIR, f"{next_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    return payload


def _next_course_id(topic: str):
    os.makedirs(COURSE_DIR, exist_ok=True)
    base = _slugify(topic)
    max_num = 0
    pattern = re.compile(rf"^{re.escape(base)}_(\d+)\.json$")

    for filename in os.listdir(COURSE_DIR):
        match = pattern.match(filename)
        if match:
            num = int(match.group(1))
            if num > max_num:
                max_num = num

    return f"{base}_{max_num + 1:04d}"


@app.post("/courses/{course_id}/modules/{module_id}/regenerate")
def regenerate_module_content(
    course_id: str,
    module_id: str,
    payload: RegenerateRequest
):
    path = os.path.join(COURSE_DIR, f"{course_id}.json")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Course not found")

    with open(path, "r", encoding="utf-8") as f:
        course_data = json.load(f)

    learning_request = course_data.get("learning_request", {})
    curriculum = course_data.get("course", {}).get("curriculum", {})
    modules = curriculum.get("curriculum", {}).get("modules", [])

    module = next((m for m in modules if m.get("module_id") == module_id), None)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Regenerate content for the specific module
    module_prompt = f"""Overall learning request:
    {learning_request}

    This is the curriculum module you MUST focus on:
    {module}

    Remember to follow instructions and return ONLY the JSON matching the schema.
    """
    if payload.custom_request:
        module_prompt += f"\nCustom request from user:\n{payload.custom_request}\n"
    user_proxy.initiate_chat(
        module_content_author,
        message=module_prompt,
        max_turns=1
    )
    raw_module_content = module_content_author.last_message()["content"]
    clean_module_json_text = extract_json(raw_module_content)
    module_content_json = json.loads(clean_module_json_text)
    validate_json(module_content_json, "module_content.json")
    course_data["course"]["module_contents"][module_id] = module_content_json
    with open(f"output/modules/{module['module_id']}_content.json", "w") as f:
        json.dump(module_content_json, f, indent=2)

    print(f"Content for module '{module['title']}' regenerated and saved to output/modules/{module['module_id']}_content.json\n")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(course_data, f, indent=2)

    return course_data



def _slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return cleaned or COURSE_PREFIX.rstrip("_")


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
