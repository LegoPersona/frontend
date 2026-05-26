import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface UploadResponse {
  jobId: string;
  status: string;
}

export interface StatusResponse {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  resultPersonaId?: string;
  errorMessage?: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${API_URL}/v1/personas`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${token}`
      },
    }
  );

  return response.data;
};

export const getGenerationStatus = async (jobId: string): Promise<StatusResponse> => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(
    `${API_URL}/v1/personas/tasks/${jobId}/status`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }
  );

  return response.data;
};