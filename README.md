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

## Notes
- Course files are stored as JSON. No SQL server is required.
- Each course is saved with a topic-based ID like `spanish_0001`.
- The UI is organized into pages and components for maintainability.
