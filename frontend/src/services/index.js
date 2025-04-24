import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const res = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return res.data;
}
