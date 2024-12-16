"use client";

import { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  TextField
} from "@mui/material";

import { useDocumentService } from "../services/documentService";

type AddNewGroupProps = {
  groups: string[]
};

const AddNewGroup: React.FC<AddNewGroupProps> = ({ groups }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const { uploadDocument } = useDocumentService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);
    try {
      const success = await uploadDocument(file, newGroup);
      if (success) {
        alert("File uploaded successfully");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (newGroup) {
          const updatedQuery = new URLSearchParams({ group: newGroup });
          window.location.href = `/documents?${updatedQuery.toString()}`;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroup(e.target.value);
    setIsTouched(false);
  }

  const isValidNewGroup = isTouched && groups.includes(newGroup);
  const isUploadDisabled = loading || (!file || !newGroup) || isValidNewGroup;

  return (
    <div>
      {/* Trigger Button */}
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add New Group
      </Button>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <div className="flex justify-between items-center mt-4 mr-6">
          <DialogTitle>Add New Group</DialogTitle>
          <TextField
            label="Enter New Group"
            variant="outlined"
            size="small"
            required
            value={newGroup}
            onChange={handleChange}
            onBlur={() => setIsTouched(true)}
            error={isValidNewGroup}
            helperText={ isValidNewGroup && "This group already exist"}
          />
        </div>
        <DialogContent className="h-26">
        <input
            type="file"
            required
            ref={fileInputRef}
            onChange={handleFileChange}
            className="border rounded mt-2 px-4 py-2 w-full"
          />
        </DialogContent>
        <DialogActions className="mb-6 pr-6">
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploadDisabled}
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddNewGroup;
