"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useDocumentService } from "../services/documentService";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom service hooks for document operations
  const {
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    bulkDeleteDocuments,
  } = useDocumentService();

  // Fetch documents whenever the page changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchDocuments(page);
      if (result) {
        setDocuments(result.archivesWithUrl);
        setTotalPages(result.totalPages);
      }
      setLoading(false);
    };
    fetchData();
  }, [page]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");

    setLoading(true);
    const success = await uploadDocument(file);
    setLoading(false);

    if (success) {
      alert("File uploaded successfully");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      const result = await fetchDocuments(page);
      setDocuments(result.archivesWithUrl);
      setTotalPages(result.totalPages);
    } else {
      alert("Failed to upload file");
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const success = await deleteDocument(id);
    setLoading(false);

    if (success) {
      alert("Document deleted successfully");
      const result = await fetchDocuments(page);
      setDocuments(result.archivesWithUrl);
      setTotalPages(result.totalPages);
    } else {
      alert("Failed to delete document");
    }
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    const success = await bulkDeleteDocuments(selectedDocuments);
    setLoading(false);

    if (success) {
      alert("Documents deleted successfully");
      setSelectedDocuments([]);
      const result = await fetchDocuments(page);
      setDocuments(result.archivesWithUrl);
      setTotalPages(result.totalPages);
    } else {
      alert("Failed to delete documents");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedDocuments(checked ? documents.map((doc) => doc.id) : []);
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
            ref={fileInputRef}
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
