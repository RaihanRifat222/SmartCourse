import React from "react";
import CourseForm from "../components/CourseForm";
import LessonViewer from "../components/LessonViewer";

function Home({
  formData,
  onChange,
  onGenerate,
  loading,
  loadingCourses,
  latestCourse,
}) {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Build beautiful curricula in minutes.</h1>
          <p>
            Describe the audience and goals. SmartCourse generates a structured
            curriculum with concepts, applied practice, and examples.
          </p>
        </div>
      </section>

      <CourseForm
        formData={formData}
        onChange={onChange}
        onSubmit={onGenerate}
        loading={loading}
      />

      {loadingCourses && <p className="muted">Loading saved courses...</p>}

      {latestCourse && (
        <section className="course-stack">
          <div className="stack-header">
            <div>
              <h2>Latest Course</h2>
              <p className="muted">{latestCourse.created_at}</p>
            </div>
            <span className="pill">{latestCourse.id}</span>
          </div>
          {latestCourse.learning_request?.custom_request && (
            <div className="card custom-note">
              <p className="meta-label">Custom Instructions</p>
              <p>{latestCourse.learning_request.custom_request}</p>
            </div>
          )}
          <LessonViewer course={latestCourse.course} />
        </section>
      )}
    </div>
  );
}

export default Home;
