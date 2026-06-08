import api from './api';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post('/personas', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getGenerationStatus = async (jobId: string) => {
  const response = await api.get(`/personas/tasks/${jobId}/status`);

  return response.data;
};