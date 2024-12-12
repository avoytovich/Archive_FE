import axios from "axios";
import { useMemo } from "react";

// Axios instance with baseURL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8033",
});

// Axios interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Utility to create FormData
const createFormData = (file: File, group?: string): FormData => {
  const formData = new FormData();
  formData.append("archive", file);
  formData.append("group", group || "");
  return formData;
};

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

type FetchDocumentsResponse = {
  archivesWithUrl: Document[]; // Or your actual type
  totalPages: number;
};

// Service hook
export const useDocumentService = () => {
  const fetchDocuments = async (page: number, group?: string): Promise<FetchDocumentsResponse | null> => {
    try {
      const { data } = await apiClient.get<FetchDocumentsResponse | null>("/archives", {
        params: { page: page - 1, size: 5, group },
      });
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return null;
    }
  };

  const uploadDocument = async (file: File, group?: string): Promise<boolean> => {
    try {
      const formData = createFormData(file, group);
      await apiClient.post("/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error uploading document:", error);
      return false;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/archives/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  };

  const bulkDeleteDocuments = async (ids: string[]): Promise<boolean> => {
    try {
      await apiClient.post("/archives/bulk-delete", { ids });
      return true;
    } catch (error) {
      console.error("Error bulk deleting documents:", error);
      return false;
    }
  };

  const fetchGroups = async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[]>("/groups");
      return data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      return [];
    }
  };

  return useMemo(
    () => ({
      fetchDocuments,
      uploadDocument,
      deleteDocument,
      bulkDeleteDocuments,
      fetchGroups,
    }),
    []
  );
};
