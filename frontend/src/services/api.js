import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";



export async function generateCourse(payload) {
  const response = await axios.post(`${API_BASE_URL}/generate_course`, payload);
  return response.data;
}

export async function listCourses() {
  const response = await axios.get(`${API_BASE_URL}/courses`);
  return response.data;
}

export async function regenerateModule(courseId, moduleId, customRequest) {
  const response = await axios.post(
    `${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/regenerate`,
    { custom_request: customRequest || "" }
  );
  return response.data;
}
