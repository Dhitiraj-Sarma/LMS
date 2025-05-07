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

export async function mediaDeleteService(id) {
  const res = await axiosInstance.delete(`/media/delete/${id}`);
  return res.data;
}

export async function fetchInstructorCourseListService() {}

export async function addNewCourseService() {}

export async function fetchInstructorCourseDetailsService() {}

export async function updateCourseByIdService() {}
