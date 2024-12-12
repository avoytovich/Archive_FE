"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
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
  TextField,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useDocumentService } from "../../services/documentService";

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newGroup, setNewGroup] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedGroup = searchParams.get("group") || "";

  const {
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    bulkDeleteDocuments,
  } = useDocumentService();

  const refreshDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchDocuments(
        page,
        newGroup || selectedGroup || undefined
      );
      if (result) {
        setDocuments(result.archivesWithUrl);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [page, newGroup, selectedGroup, fetchDocuments]);

  useEffect(() => {
    if (selectedGroup !== "a new one") refreshDocuments();
  }, [selectedGroup, refreshDocuments]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);
    try {
      const success = await uploadDocument(file, newGroup || selectedGroup);
      if (success) {
        alert("File uploaded successfully");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        refreshDocuments();
        if (newGroup) {
          const updatedQuery = new URLSearchParams({ group: newGroup });
          window.location.href = `${pathname}?${updatedQuery.toString()}`;
        }
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setNewGroup("");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteDocument(id);
      if (success) {
        alert("Document deleted successfully");
        refreshDocuments();
      } else {
        alert("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedDocuments.length) {
      alert("Please select documents to delete.");
      return;
    }
    setLoading(true);
    try {
      const success = await bulkDeleteDocuments(selectedDocuments);
      if (success) {
        alert("Documents deleted successfully");
        setSelectedDocuments([]);
        refreshDocuments();
      } else {
        alert("Failed to delete documents");
      }
    } catch (error) {
      console.error("Error deleting documents:", error);
    } finally {
      setLoading(false);
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

  const isUploadDisabled = loading || (!file || (selectedGroup === "a new one" && !newGroup));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Document Management</h1>
        <h2 className="text-lg mb-4">
          Group: <strong>{newGroup || selectedGroup}</strong>
        </h2>

        {selectedGroup === "a new one" && (
          <TextField
            label="Enter New Group Name"
            variant="outlined"
            size="small"
            required
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="mb-2"
          />
        )}

        <div className="mb-6 flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded px-4 py-2 w-full"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploadDisabled}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </div>

        <div className="mb-4 flex justify-end">
          <Button
            variant="contained"
            color="error"
            disabled={!selectedDocuments.length || loading}
            onClick={handleBulkDelete}
          >
            {loading ? <CircularProgress size={24} /> : `Delete ${selectedDocuments.length} Selected`}
          </Button>
        </div>

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
                        className="text-blue-500 underline"
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

export default Documents;
