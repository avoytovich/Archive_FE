"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import Pagination from "@mui/material/Pagination";

type Document = {
  id: string;
  title: string;
  fileUrl: string;
};

const Home: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1); // Start from page 1
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  // Fetch documents whenever the page changes
  useEffect(() => {
    fetchDocuments(page);
  }, [page]);

  const fetchDocuments = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8033/archives?page=${page-1}&size=5`);
      setDocuments(data.archivesWithUrl); // Assuming your response has archivesWithUrl
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("archive", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8033/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
      setDocuments([]); // Reset list to reload
      fetchDocuments(page); // Reset to the first page
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">

        {/* Upload Section */}
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ height: '42px' }}
            className="border rounded px-4 py-2 w-full"
          />
          <button
            onClick={handleFileUpload}
            style={{ height: '42px', marginTop: '0' }}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Documents List */}
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
              <span className="font-medium">{doc.title}</span>
              <a href={doc.fileUrl} download className="text-blue-500">
                <ArrowDownCircleIcon className="h-6 w-6" />
              </a>
            </li>
          ))}
        </ul>

        {/* MUI Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)} // Handle page change
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
