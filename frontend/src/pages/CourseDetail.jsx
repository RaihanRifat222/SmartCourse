import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";

function CourseDetail({ courses, loadingCourses, onRegenerateModule }) {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId);
  const [regenerating, setRegenerating] = useState({});
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [customRequest, setCustomRequest] = useState("");

  const openRegenerateModal = (moduleId) => {
    setActiveModuleId(moduleId);
    setCustomRequest("");
  };

  const closeRegenerateModal = () => {
    setActiveModuleId(null);
    setCustomRequest("");
  };

  const handleConfirmRegenerate = async () => {
    if (!onRegenerateModule || !course || !activeModuleId) return;
    setRegenerating((prev) => ({ ...prev, [activeModuleId]: true }));
    try {
      await onRegenerateModule(course.id, activeModuleId, customRequest || "");
      closeRegenerateModal();
    } catch (error) {
      console.error("Error regenerating module:", error);
    } finally {
      setRegenerating((prev) => ({ ...prev, [activeModuleId]: false }));
    }
  };

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
          <LessonViewer
            course={course.course}
            courseId={course.id}
            onRegenerateRequest={openRegenerateModal}
            regenerating={regenerating}
          />
        </section>
      )}

      {activeModuleId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Regenerate Module</h3>
            <p className="muted">
              Add optional instructions for how you want this module revised.
            </p>
            <textarea
              className="modal-textarea"
              rows={5}
              placeholder="E.g. make it more conversational, add a role-play, include more examples..."
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
            />
            <div className="modal-actions">
              <button className="secondary-button" onClick={closeRegenerateModal}>
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleConfirmRegenerate}
                disabled={regenerating?.[activeModuleId]}
              >
                {regenerating?.[activeModuleId] ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
