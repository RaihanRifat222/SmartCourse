from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
import json
import os

from course_engine import generate_course
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() 
class CourseRequest(BaseModel):
    topic: str
    audience: Dict[str, Any]
    learning_goals: list[str]
    constraints: Dict[str, Any]

@app.post("/generate_course")

def generate_course_endpoint(request: CourseRequest):
    result = generate_course(request.dict())
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)