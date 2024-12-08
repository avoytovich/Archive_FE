import axios from "axios";

export const useDocumentService = () => {
  const fetchDocuments = async (page: number) => {
    try {
      const { data } = await axios.get(`http://localhost:8033/archives?page=${page - 1}&size=5`);
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return null;
    }
  };

  const uploadDocument = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("archive", file);

      await axios.post("http://localhost:8033/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8033/archives/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  };

  const bulkDeleteDocuments = async (ids: string[]) => {
    try {
      await axios.post("http://localhost:8033/archives/bulk-delete", { ids });
      return true;
    } catch (error) {
      console.error("Error bulk deleting documents:", error);
      return false;
    }
  };

  return { fetchDocuments, uploadDocument, deleteDocument, bulkDeleteDocuments };
};
