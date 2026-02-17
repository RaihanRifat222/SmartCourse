import React, {useState} from "react";
import axios from "axios";
function App() {

  const [formData, setFormData] = useState({
    topic: "",
    audienceRole: "",
    priorKnowledge: "",
    seniority: "",
    learningGoals: "",
    depth: "",
    tone: "",
  });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateCourse = async () => {
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:8000/generate_course", 
        {
          topic: formData.topic,
          audience: {
            role: formData.audienceRole,
            prior_knowledge: formData.priorKnowledge,
            seniority: formData.seniority
          },
          learning_goals: formData.learningGoals.split(",").map(goal => goal.trim()),
          constraints: {
            depth: formData.depth,
            tone: formData.tone
          }
        }
      );
      setCourse(response.data);
    } catch (error) {
    
      console.error("Error generating course:", error);
    }
    setLoading(false);
  }
  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>SmartCourse AI</h1>

      <input name="topic" placeholder="Course Topic"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="audienceRole" placeholder="Audience Role"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="priorKnowledge" placeholder="Prior Knowledge"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="seniority" placeholder="Seniority"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="learningGoals" placeholder="Learning Goals (comma separated)"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="depth" placeholder="Depth (Beginner/Intermediate/Advanced)"
        onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

      <input name="tone" placeholder="Tone (Professional/Friendly/etc)"
        onChange={handleChange} style={{ width: "100%", marginBottom: 20 }} />

      <button onClick={generateCourse}>
        Generate Course
      </button>

      {loading && <p>Generating course...</p>}

      {course && (
  <div style={{ marginTop: 40 }}>
    <h2>{course.curriculum.curriculum.modules.length} Modules</h2>

    {course.curriculum.curriculum.modules.map((module) => {
      const content = course.module_contents[module.module_id];

      return (
        <div
          key={module.module_id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: "#f9f9f9"
          }}
        >
          <h3>{module.title}</h3>

          <h4>Learning Objectives</h4>
          <ul>
            {module.learning_objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>

          {content?.module_content?.sections?.map((section) => (
            <div key={section.section_id} style={{ marginTop: 20 }}>
              <h4>{section.title}</h4>

              <p><strong>Concept:</strong></p>
              <p>{section.conceptual_explanation}</p>

              <p><strong>Applied:</strong></p>
              <p>{section.applied_explanation}</p>

              <p><strong>Example:</strong></p>
              <pre
                style={{
                  backgroundColor: "#222",
                  color: "#0f0",
                  padding: 10,
                  borderRadius: 5,
                  overflowX: "auto"
                }}
              >
                {section.example}
              </pre>

              <p><strong>Practice Questions:</strong></p>
              <ul>
                {section.practice_questions.map((q, idx) => (
                  <li key={idx}>{q.question}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    })}
  </div>
)}
    </div>
  );
}

export default App;
