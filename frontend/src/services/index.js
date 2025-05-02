import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const res = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return res.data;
}

export async function loginService(formData) {
  const res = await axiosInstance.post("/auth/login", formData);

  return res.data;
}

export async function checkAuthService() {
  const res = await axiosInstance.get("/auth/check-auth");
  return res.data;
}

export async function mediaUploadService(formData, onProgressCallBack) {
  const res = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (ProgressEvent) => {
      const percentCompleted = Math.round(
        (ProgressEvent.loaded * 100) / ProgressEvent.total
      );
      onProgressCallBack(percentCompleted);
    },
  });
  return res.data;
}
