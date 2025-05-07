import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const res = await axiosInstance.post("/auth/register", {
    ...formData,
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

export async function fetchInstructorCourseListService() {
  const res = await axiosInstance.get("/instructor/course/get");
  return res.data;
}

export async function addNewCourseService(formData) {
  const res = await axiosInstance.post("/instructor/course/add", formData);

  return res.data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const res = await axiosInstance.get(`/instructor/course//get/details/${id}`);
  return res.data;
}

export async function updateCourseByIdService(id, formData) {
  const res = await axiosInstance.put(
    `/instructor/course//update/${id}`,
    formData
  );

  return res.data;
}
