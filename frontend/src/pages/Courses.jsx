import React from "react";
import { Link } from "react-router-dom";

function Courses({ courses, loadingCourses }) {
  const formatDate = (value) => {
    if (!value) return "Unknown date";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  return (
    <div className="page">
      <section className="hero hero-compact">
        <div>
          <h1>All Courses</h1>
          <p>Browse every curriculum you have generated so far.</p>
        </div>
      </section>

      {loadingCourses && (
        <div className="course-list">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card course-row skeleton-card">
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )}

      {!loadingCourses && courses.length === 0 && (
        <div className="card empty-state">
          <div className="empty-illustration" aria-hidden="true" />
          <h3>No courses yet</h3>
          <p>Generate your first course from the Home page.</p>
        </div>
      )}

      <div className="course-list">
        {courses.map((savedCourse) => (
          <div key={savedCourse.id} className="card course-row">
            <div className="course-meta">
              <div>
                <p className="meta-label">Topic</p>
                <h2>{savedCourse.learning_request?.topic || savedCourse.id}</h2>
              </div>
              <div className="meta-grid">
                <div>
                  <p className="meta-label">Audience</p>
                  <p>{savedCourse.learning_request?.audience?.seniority || "N/A"}</p>
                </div>
                <div>
                  <p className="meta-label">Depth</p>
                  <p>{savedCourse.learning_request?.constraints?.depth || "N/A"}</p>
                </div>
                <div>
                  <p className="meta-label">Created</p>
                  <p>{formatDate(savedCourse.created_at)}</p>
                </div>
              </div>
              {savedCourse.learning_request?.custom_request && (
                <div className="custom-note">
                  <p className="meta-label">Custom Instructions</p>
                  <p>{savedCourse.learning_request.custom_request}</p>
                </div>
              )}
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
