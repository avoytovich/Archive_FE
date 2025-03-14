import { useMemo } from 'react';
import axios from 'axios';
import { handleError } from '@/utils';

// Axios instance with baseURL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8033',
});

// Axios interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    console.log('API Error:', error);
    return Promise.reject(error);
  }
);

const createFormData = (file: File, group?: string): FormData => {
  const formData = new FormData();
  formData.append('archive', file);
  formData.append('group', group || '');
  return formData;
};

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

type FetchDocumentsResponse = {
  archivesWithUrl: Document[];
  totalPages: number;
};

export const useServices = () => {
  const fetchDocuments = async (
    page: number,
    group?: string,
    search?: string
  ): Promise<FetchDocumentsResponse | null> => {
    try {
      const { data } = await apiClient.get<FetchDocumentsResponse | null>(
        '/archives',
        {
          params: { page: page - 1, size: 5, group, search },
        }
      );
      return data;
    } catch (error: unknown) {
      handleError(error, 'Error fetching documents');
      return null;
    }
  };

  const uploadDocument = async (
    file: File,
    group?: string
  ): Promise<boolean> => {
    try {
      const formData = createFormData(file, group);
      await apiClient.post('/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error uploading document');
      return false;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/archives/${id}`);
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error deleting document');
      return false;
    }
  };

  const bulkDeleteDocuments = async (ids: string[]): Promise<boolean> => {
    try {
      await apiClient.post('/archives/bulk-delete', { ids });
      return true;
    } catch (error: unknown) {
      handleError(error, 'Error bulk deleting documents');
      return false;
    }
  };

  const fetchGroups = async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[]>('/groups');
      return data;
    } catch (error: unknown) {
      handleError(error, 'Error fetching groups');
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
