import React from "react";

function CourseForm({ formData, onChange, onSubmit, loading }) {
  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>Generate a Course</h2>
        <p>Describe your audience and goals. We will build a full curriculum.</p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Course Topic</span>
          <input
            name="topic"
            placeholder="Introduction to Python"
            onChange={onChange}
            value={formData.topic}
          />
        </label>

        <label className="field">
          <span>Audience Role</span>
          <input
            name="audienceRole"
            placeholder="Undergraduate Students"
            onChange={onChange}
            value={formData.audienceRole}
          />
        </label>

        <label className="field">
          <span>Prior Knowledge</span>
          <input
            name="priorKnowledge"
            placeholder="Basic data literacy"
            onChange={onChange}
            value={formData.priorKnowledge}
          />
        </label>

        <label className="field">
          <span>Seniority</span>
          <input
            name="seniority"
            placeholder="Beginner"
            onChange={onChange}
            value={formData.seniority}
          />
        </label>

        <label className="field field-wide">
          <span>Learning Goals</span>
          <input
            name="learningGoals"
            placeholder="Syntax, functions, data structures"
            onChange={onChange}
            value={formData.learningGoals}
          />
        </label>

        <label className="field">
          <span>Depth</span>
          <input
            name="depth"
            placeholder="Beginner / Intermediate / Advanced"
            onChange={onChange}
            value={formData.depth}
          />
        </label>

        <label className="field">
          <span>Tone</span>
          <input
            name="tone"
            placeholder="Professional / Friendly / Hands-on"
            onChange={onChange}
            value={formData.tone}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={onSubmit} disabled={loading}>
          {loading ? "Generating..." : "Generate Course"}
        </button>
      </div>
    </div>
  );
}

export default CourseForm;
