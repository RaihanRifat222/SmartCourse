import React from "react";
import { useParams, Link } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";

function CourseDetail({ courses, loadingCourses }) {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId);

  return (
    <div className="page">
      <section className="hero hero-compact">
        <div>
          <h1>Course Detail</h1>
          <p>Review the full curriculum and module content.</p>
        </div>
      </section>

      <div className="card">
        <div className="detail-actions">
          <Link className="text-link" to="/courses">
            ← Back to all courses
          </Link>
          {course && (
            <a
              className="primary-button"
              href={`http://localhost:8000/courses/${course.id}/export?format=pdf&ts=${Date.now()}`}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>

      {loadingCourses && <p className="muted">Loading saved courses...</p>}

      {!loadingCourses && !course && (
        <div className="card empty-state">
          <h3>Course not found</h3>
          <p>The course ID "{courseId}" does not exist.</p>
        </div>
      )}

      {course && (
        <section className="course-stack">
          <div className="stack-header">
            <div>
              <h2>{course.id}</h2>
              <p className="muted">{course.created_at}</p>
            </div>
            <span className="pill">Saved course</span>
          </div>
          <LessonViewer course={course.course} />
        </section>
      )}
    </div>
  );
}

export default CourseDetail;
