import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import { generateCourse, listCourses } from "./services/api";
import "./App.css";
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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await listCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
      setLoadingCourses(false);
    };
    loadCourses();
  }, []);

  const handleGenerateCourse = async () => {
    setLoading(true);
    try {
      const payload = {
        topic: formData.topic,
        audience: {
          role: formData.audienceRole,
          prior_knowledge: formData.priorKnowledge,
          seniority: formData.seniority,
        },
        learning_goals: formData.learningGoals
          .split(",")
          .map((goal) => goal.trim()),
        constraints: {
          depth: formData.depth,
          tone: formData.tone,
        },
      };

      const savedCourse = await generateCourse(payload);
      setCourses((prev) => [savedCourse, ...prev]);
    } catch (error) {
      console.error("Error generating course:", error);
    }
    setLoading(false);
  };
  return (
    <div className="app">
      <NavBar />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                formData={formData}
                onChange={handleChange}
                onGenerate={handleGenerateCourse}
                loading={loading}
                loadingCourses={loadingCourses}
                latestCourse={courses[0]}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <Courses
                courses={courses}
                loadingCourses={loadingCourses}
              />
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <CourseDetail
                courses={courses}
                loadingCourses={loadingCourses}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
