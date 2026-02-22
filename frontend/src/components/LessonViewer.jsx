import React from "react";

function LessonViewer({ course, courseId, onRegenerateRequest, regenerating }) {
  if (!course) return null;

  const modules = course?.curriculum?.curriculum?.modules || [];

  return (
    <div className="lesson-viewer">
      <div className="section-header">
        <h2>{modules.length} Modules</h2>
        <p>Structured learning paths with concepts, applied practice, and examples.</p>
      </div>

      {modules.map((module) => {
        const content = course.module_contents?.[module.module_id];

        return (
          <div key={module.module_id} className="card module-card">
            <div className="module-header">
              <h3>{module.title}</h3>
              {onRegenerateRequest && courseId && (
                <button
                  className="secondary-button"
                  onClick={() => onRegenerateRequest(module.module_id)}
                  disabled={regenerating?.[module.module_id]}
                >
                  {regenerating?.[module.module_id]
                    ? "Regenerating..."
                    : "Regenerate Module"}
                </button>
              )}
            </div>

            <h4>Learning Objectives</h4>
            <ul>
              {module.learning_objectives?.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>

            {content?.module_content?.sections?.map((section) => (
              <div key={section.section_id} className="module-section">
                <h4>{section.title}</h4>

                <div className="section-block">
                  <span className="section-label">Concept</span>
                  <p>{section.conceptual_explanation}</p>
                </div>

                <div className="section-block">
                  <span className="section-label">Applied</span>
                  <p>{section.applied_explanation}</p>
                </div>

                <div className="section-block">
                  <span className="section-label">Example</span>
                  <pre className="code-block">{section.example}</pre>
                </div>

                <div className="section-block">
                  <span className="section-label">Practice Questions</span>
                  <ul>
                    {section.practice_questions?.map((q, idx) => (
                      <li key={idx}>{q.question}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default LessonViewer;
