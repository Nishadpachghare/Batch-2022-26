import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ||
  (import.meta.env.PROD ? "https://batch-2022-26-backend.vercel.app" : "");

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 120000, // 120 sec timeout for large file uploads
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

    const response = await api.patch(`/api/students/${studentId}`, formData, {
      timeout: 120000, // 120 sec timeout for large file uploads (photo/video up to 200MB)
    });
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

// ✅ Compress image before upload
async function compressImage(file, maxSizeMB = 5) {
  if (!file.type.startsWith("image/")) return file; // Not an image

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        
        // Reduce to max 1920px width while maintaining aspect ratio
        if (width > 1920) {
          height = (height * 1920) / width;
          width = 1920;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d", { alpha: true });
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with reduced quality
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: file.lastModified,
            });
            
            // If still too large, reduce quality more
            if (compressedFile.size > maxSizeMB * 1024 * 1024) {
              canvas.toBlob(
                (blob2) => {
                  const finalFile = new File([blob2], file.name, {
                    type: "image/jpeg",
                    lastModified: file.lastModified,
                  });
                  resolve(finalFile);
                },
                "image/jpeg",
                0.6
              );
            } else {
              resolve(compressedFile);
            }
          },
          "image/jpeg",
          0.85
        );
      };
    };
  });
}

async function uploadMemory(payload) {
  /**
   * Single Memory Upload
   * Sends file + metadata to backend via FormData
   * Backend processes the upload and returns created Media document with Cloudinary URL
   */
  const formData = new FormData();
  formData.append("file", payload.file); // Actual file for Cloudinary upload
  formData.append("caption", payload.caption); // Display caption in Media Vault
  formData.append("year", payload.year);
  formData.append("category", payload.category);
  formData.append("uploadedBy", payload.uploadedBy);
  formData.append("studentId", payload.studentId); // Store uploader's ID in MongoDB
  formData.append("studentName", payload.studentName); // Store uploader's name

  // 120 sec timeout for large video uploads (up to 200MB)
  const response = await api.post("/api/media", formData, {
    timeout: 120000,
  });
  
  // Returns: Complete Media document from MongoDB with:
  // - url: Cloudinary secure URL
  // - uploadedAt: timestamp
  // - year, studentId, studentName: metadata
  return response.data;
}

// ✅ Upload multiple files in parallel (2 at a time for better performance)
// FLOW: Frontend → Compress → Backend → Cloudinary → MongoDB → Return URL to Frontend
async function uploadMemoriesParallel(payloads) {
  /**
   * Memory Upload Process:
   * 1. Send each file to backend with metadata (studentId, year, caption, etc.)
   * 2. Backend receives file + FormData with metadata
   * 3. Backend uploads to Cloudinary with secure URL generation
   * 4. Cloudinary returns secure_url
   * 5. Backend creates MongoDB Media document with the URL, metadata, and timestamps
   * 6. Backend returns the complete Media document to frontend
   * 7. Frontend displays success/error messages
   * 8. Users can view their uploaded memories in MediaVault page
   */
  const results = [];
  const errors = [];
  const CONCURRENT_LIMIT = 2; // Upload 2 files at a time to avoid overwhelming backend
  
  for (let i = 0; i < payloads.length; i += CONCURRENT_LIMIT) {
    const batch = payloads.slice(i, i + CONCURRENT_LIMIT);
    const batchResults = await Promise.allSettled(
      batch.map((payload) => uploadMemory(payload))
    );
    
    batchResults.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        // ✅ Upload successful - MongoDB document with Cloudinary URL is returned
        results.push(result.value);
      } else {
        // ❌ Upload failed - store error info for user feedback
        errors.push({
          file: batch[idx].file?.name || `File ${i + idx + 1}`,
          error: result.reason,
        });
      }
    });
  }
  
  return { results, errors };
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
  compressImage,
  getApiErrorMessage,
  getMedia,
  getMessages,
  getStudents,
  postMessage,
  updateStudent,
  uploadMemory,
  uploadMemoriesParallel,
};

export default api;
