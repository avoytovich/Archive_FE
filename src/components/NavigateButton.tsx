"use client";

import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";

import { handleNavigate } from "@/utils/navigation";

const NavigateButton: React.FC<{
  selectedGroup: string;
  loading: boolean;
}> = ({ selectedGroup, loading }) => {

  const router = useRouter();
  
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={() => handleNavigate(router, selectedGroup)}
      disabled={!selectedGroup || loading}
    >
      {loading ? <CircularProgress size={24} /> : "Go to Documents"}
    </Button>
  );
}

export default NavigateButton;
