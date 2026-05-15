import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(
    `${API_URL}/generate`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getGenerationStatus = async (jobId: string) => {
  const response = await axios.get(
    `${API_URL}/generate/${jobId}/status`
  );

  return response.data;
};

export const getGenerationResult = async (jobId: string) => {
  const response = await axios.get(
    `${API_URL}/generate/${jobId}/result`
  );

  return response.data;
};