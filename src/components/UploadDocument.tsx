import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

type UploadDocumentsProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  setFile: (f: File | null) => void;
  loading: boolean;
  handleUpload: () => void;
  isUploadDisabled: boolean;
};

const UploadDocuments: React.FC<UploadDocumentsProps> = ({ fileInputRef, setFile, loading, handleUpload, isUploadDisabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <div>
      {/* Trigger Button */}
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Upload Documents
      </Button>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent className="h-26">
        <input
            type="file"
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
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDocuments;
