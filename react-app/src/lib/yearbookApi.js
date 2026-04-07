import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ||
  (import.meta.env.PROD ? "https://batch-2022-26-backend.vercel.app" : "");

const api = axios.create({
  baseURL: apiBaseURL,
});

function getApiErrorMessage(error, fallbackMessage) {
  const responseError = error?.response?.data?.error;

  if (typeof responseError === "string") {
    return responseError;
  }

  if (responseError && typeof responseError === "object") {
    return (
      responseError.message ||
      responseError.error ||
      responseError.code ||
      fallbackMessage ||
      "Something went wrong."
    );
  }

  const responseMessage = error?.response?.data?.message;

  if (typeof responseMessage === "string") {
    return responseMessage;
  }

  return (
    (typeof error?.message === "string" ? error.message : "") ||
    fallbackMessage ||
    "Something went wrong."
  );
}

async function getStudents() {
  const response = await api.get("/api/students");
  return response.data;
}

async function updateStudent(studentId, payload) {
  // If there's an image file, use FormData (multipart)
  // Otherwise, use JSON for better compatibility
  if (payload.imageFile) {
    const formData = new FormData();

    if (payload.name !== undefined) {
      formData.append("name", payload.name);
    }

    if (payload.roll !== undefined) {
      formData.append("roll", payload.roll);
    }

    if (payload.year !== undefined) {
      formData.append("year", payload.year);
    }

    if (payload.email !== undefined) {
      formData.append("email", payload.email);
    }

    formData.append("image", payload.imageFile);

    const response = await api.patch(`/api/students/${studentId}`, formData);
    return response.data;
  }

  // For non-file updates, send as JSON
  const jsonPayload = {};

  if (payload.name !== undefined) {
    jsonPayload.name = payload.name;
  }

  if (payload.roll !== undefined) {
    jsonPayload.roll = payload.roll;
  }

  if (payload.year !== undefined) {
    jsonPayload.year = payload.year;
  }

  if (payload.email !== undefined) {
    jsonPayload.email = payload.email;
  }

  const response = await api.patch(`/api/students/${studentId}`, jsonPayload);
  return response.data;
}

async function getMedia() {
  const response = await api.get("/api/media");
  return response.data;
}

async function uploadMemory(payload) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("caption", payload.caption);
  formData.append("year", payload.year);
  formData.append("category", payload.category);
  formData.append("uploadedBy", payload.uploadedBy);
  formData.append("studentId", payload.studentId);
  formData.append("studentName", payload.studentName);

  const response = await api.post("/api/media", formData);
  return response.data;
}

async function getMessages() {
  const response = await api.get("/api/messages");
  return response.data;
}

async function postMessage(payload) {
  const response = await api.post("/api/messages", payload);
  return response.data;
}

export {
  api,
  getApiErrorMessage,
  getMedia,
  getMessages,
  getStudents,
  postMessage,
  updateStudent,
  uploadMemory,
};

export default api;
