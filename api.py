from fastapi import FastAPI, Response, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import json
import os
import textwrap
import re
import html
from datetime import datetime
from markdown import markdown
from fastapi.middleware.cors import CORSMiddleware
import pdfkit

from course_engine import generate_course


app = FastAPI()

COURSE_DIR = "output/courses"
COURSE_PREFIX = "course_"

WKHTMLTOPDF_PATH = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
PDFKIT_CONFIG = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)

PDF_OPTIONS = {
    "page-size": "A4",
    "margin-top": "20mm",
    "margin-bottom": "20mm",
    "margin-left": "20mm",
    "margin-right": "20mm",
    "encoding": "UTF-8",
}


class CourseRequest(BaseModel):
    topic: str
    audience: Dict[str, Any]
    learning_goals: list[str]
    constraints: Dict[str, Any]


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


# =========================
# Export Endpoint
# =========================

@app.get("/courses/{course_id}/export")
def export_course(course_id: str, format: str = "pdf"):
    path = os.path.join(COURSE_DIR, f"{course_id}.json")

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Course not found")

    with open(path, "r", encoding="utf-8") as f:
        course_data = json.load(f)

    markdown_text = _render_course_markdown(course_data["course"])
    html_body = markdown(markdown_text, extensions=["fenced_code", "tables"])
    html_page = _wrap_html(html_body)

    if format == "pdf":
        pdf_bytes = pdfkit.from_string(
            html_page,
            False,
            configuration=PDFKIT_CONFIG,
            options=PDF_OPTIONS
        )

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={course_id}.pdf"
            }
        )

    elif format == "html":
        return Response(content=html_page, media_type="text/html")

    else:
        raise HTTPException(status_code=400, detail="Unsupported format")


# =========================
# Markdown Rendering
# =========================

def _render_course_markdown(course: dict) -> str:
    curriculum = course.get("curriculum", {}).get("curriculum", {})
    modules = curriculum.get("modules", [])
    module_contents = course.get("module_contents", {})

    lines = []
    lines.append("# Course Curriculum")
    lines.append("")

    for module in modules:
        module_id = module.get("module_id", "")
        title = module.get("title", "Untitled Module")

        lines.append(f"## {module_id}. {title}")
        lines.append("")

        objectives = module.get("learning_objectives", [])
        if objectives:
            lines.append("### Learning Objectives")
            for obj in objectives:
                lines.append(f"- {obj}")
            lines.append("")

        content = module_contents.get(module_id, {}).get("module_content", {})
        sections = content.get("sections", [])

        for section in sections:
            section_title = section.get("title", "Section")

            lines.append(f"### {section_title}")
            lines.append("")

            concept = section.get("conceptual_explanation", "")
            if concept:
                lines.append("#### Concept")
                lines.append(concept.strip())
                lines.append("")

            applied = section.get("applied_explanation", "")
            if applied:
                lines.append("#### Applied")
                lines.append(applied.strip())
                lines.append("")

            example = section.get("example", "")
            if example:
                raw_example = textwrap.dedent(str(example)).strip()
                normalized_example = "\n".join(
                    re.sub(r"^[\s\u00A0]+", "", line) for line in raw_example.splitlines()
                ).strip()
                escaped_example = html.escape(normalized_example).replace("\n", "<br/>")

                lines.append("#### Example")
                lines.append("")
                lines.append(f'<div class="example-block">{escaped_example}</div>')
                lines.append("")

            questions = section.get("practice_questions", [])
            if questions:
                lines.append("#### Practice Questions")
                for q in questions:
                    text = q.get("question") if isinstance(q, dict) else str(q)
                    lines.append(f"- {text}")
                lines.append("")

    return "\n".join(lines).strip() + "\n"


# =========================
# HTML Wrapper
# =========================

def _wrap_html(html_body: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Course Export</title>
<style>
body {{
    font-family: Arial, sans-serif;
    color: #1c1c1c;
    line-height: 1.6;
}}

h1 {{ margin-bottom: 0.4em; }}
h2 {{ margin-top: 1.2em; }}
h3 {{ margin-top: 1em; }}
h4 {{ margin-top: 0.9em; }}

.example-block {{
    background: #f5f5f5;
    padding: 14px;
    border-radius: 8px;
    margin-top: 8px;
    margin-bottom: 16px;
    font-family: Arial, sans-serif;
    white-space: normal;
}}

.example-block pre,
.example-block code {{
    font-family: inherit;
    background: none;
    padding: 0;
}}

pre {{
    white-space: pre-wrap;
}}

code {{
    background: #f4f4f4;
    padding: 3px 6px;
    border-radius: 4px;
}}

ul {{
    margin-left: 20px;
}}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""
