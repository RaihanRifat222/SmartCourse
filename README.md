# SmartCourse

SmartCourse is a full-stack project that generates structured course curricula and module content from a learning request. The backend uses AI agents to build and validate curricula, then saves each course as a JSON file. The frontend provides a colorful UI to generate new courses and browse all previously created courses.

## What This Project Does
- Accepts a learning request (topic, audience, goals, constraints).
- Generates and validates a curriculum with multiple modules.
- Produces detailed module content for each module.
- Persists each course to `output/courses` with topic-based IDs.
- Lets users view all saved courses and drill into a single course.

## Key Features
- AI-driven curriculum generation with validation loop.
- Auto-normalization of depth vs. audience level.
- Speaking-practice requirement when goals include "speak".
- File-based course storage (no database required).
- FastAPI backend with `/generate_course` and `/courses`.
- React frontend with routing (Home and Courses pages).

## Project Structure
- `api.py`: FastAPI entrypoint with course endpoints and file storage.
- `course_engine.py`: Curriculum and module content generation pipeline.
- `agents/`: AI agents for architect, validator, and module authoring.
- `schemas/`: JSON schemas used for validation.
- `output/`: Generated curricula and per-course JSON files.
- `frontend/`: React UI with routing and a colorful design system.

## Architecture Overview
SmartCourse follows a simple pipeline with clear separation between generation, validation, storage, and presentation.

1. **Frontend (React)**
   - Collects learning request + optional custom instructions.
   - Sends requests to the FastAPI backend.
   - Renders courses, modules, and regeneration actions.

2. **API Layer (FastAPI)**
   - `POST /generate_course` triggers full course generation.
   - `GET /courses` lists all saved courses.
   - `POST /courses/{id}/modules/{module_id}/regenerate` regenerates a single module.

3. **Generation Engine (`course_engine.py`)**
   - Builds a curriculum with the `curriculum_architect`.
   - Validates structure with the `curriculum_validator`.
   - Generates per-module content with `module_content_author`.
   - Applies global custom instructions to every module.

4. **Storage (File-based)**
   - Full courses stored in `output/courses/{topic_id}.json`.
   - Per-module outputs stored in `output/modules/{module_id}_content.json`.
   - No SQL server required.

5. **Schemas and Validation**
   - JSON schemas in `schemas/` ensure consistency.
   - Invalid outputs are rejected and regenerated.

**Data Flow**
```
Frontend -> FastAPI -> course_engine -> agents -> JSON output -> Frontend
```

## How To Run (Local)

Backend:
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn api:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## API Endpoints
- `POST /generate_course`: Generates a new course and saves it to `output/courses`.
- `GET /courses`: Returns all saved courses from `output/courses`.
- `POST /courses/{id}/modules/{module_id}/regenerate`: Regenerates a single module.

## Notes
- Course files are stored as JSON. No SQL server is required.
- Each course is saved with a topic-based ID like `spanish_0001`.
- The UI is organized into pages and components for maintainability.
