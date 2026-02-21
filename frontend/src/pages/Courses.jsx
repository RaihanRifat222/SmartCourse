import React from "react";
import { Link } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";

function Courses({ courses, loadingCourses }) {
  return (
    <div className="page">
      <section className="hero hero-compact">
        <div>
          <h1>All Courses</h1>
          <p>Browse every curriculum you have generated so far.</p>
        </div>
      </section>

      {loadingCourses && <p className="muted">Loading saved courses...</p>}

      {!loadingCourses && courses.length === 0 && (
        <div className="card empty-state">
          <h3>No courses yet</h3>
          <p>Generate your first course from the Home page.</p>
        </div>
      )}

      <div className="course-list">
        {courses.map((savedCourse) => (
          <div key={savedCourse.id} className="card course-row">
            <div>
              <h2>{savedCourse.id}</h2>
              <p className="muted">{savedCourse.created_at}</p>
            </div>
            <div className="course-actions">
              <Link className="primary-button" to={`/courses/${savedCourse.id}`}>
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
