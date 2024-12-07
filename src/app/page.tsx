"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

const Home: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  // Fetch documents whenever the page changes
  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  const fetchDocuments = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8033/archives?page=${page - 1}&size=5`);
      setDocuments(data.archivesWithUrl); // Assuming your response has archivesWithUrl
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("archive", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8033/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");

      setFile(null); // Clear file state
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear input field
      }
      fetchDocuments(page); // Refresh the document list
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8033/archives/${id}`);
      alert("Document deleted successfully");
      fetchDocuments(page);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:8033/archives/delete`, {
        ids: selectedDocuments,
      });
      alert("Documents deleted successfully");
      setSelectedDocuments([]);
      fetchDocuments(page);
    } catch (error) {
      console.error("Error deleting documents:", error);
      alert("Failed to delete documents");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(documents.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedDocuments((prev) =>
      checked ? [...prev, id] : prev.filter((docId) => docId !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Document Management</h1>

        {/* Upload Section */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef} // Attach the ref
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ height: "42px" }}
            className="border rounded px-4 py-2 w-full"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </div>

        {/* Bulk Delete Button */}
        <div className="mb-4 flex justify-end">
          <Button
            variant="contained"
            color="error"
            disabled={selectedDocuments.length === 0 || loading}
            onClick={handleBulkDelete}
          >
            {loading ? <CircularProgress size={24} /> : `Delete ${selectedDocuments.length} Selected`}
          </Button>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedDocuments.length > 0 &&
                      selectedDocuments.length < documents.length
                    }
                    checked={
                      documents.length > 0 &&
                      selectedDocuments.length === documents.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) => handleSelectOne(doc.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center space-x-2">
                      <a
                        href={doc.fileUrl}
                        download
                        style={{ color: "blue", textDecoration: "none" }}
                      >
                        Read
                      </a>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDelete(doc.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
