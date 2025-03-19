import { BASE_URL } from "@/config/constant";
import axios from "axios";

export const uploadFiles = async (file, { onUploadProgress }) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}upload/uploadFile`,
      formData,
      {
        onUploadProgress,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data && Object.keys(response.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
