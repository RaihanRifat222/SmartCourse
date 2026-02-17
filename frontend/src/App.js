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
          <h2>Generated Course</h2>
          <pre>{JSON.stringify(course, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
