"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from "@mui/material";

import AddNewGroup from "@/components/AddNewGroup";
import { useDocumentService } from "../services/documentService";

const GroupSelector: React.FC = () => {
  const router = useRouter();

  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { fetchGroups } = useDocumentService();

  const handleNavigate = () => {
    if (!selectedGroup) {
      alert("Please select a group first.");
      return;
    }
    // Navigate to the document management page with the selected group
    router.push(`/documents?group=${selectedGroup}`);
  };

  // Fetch groups from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groups: string[] = await fetchGroups();
        if (groups) {
          setGroups(groups);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchGroups]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold mb-4">Select a Group</h1>
          <AddNewGroup groups={groups}/>
        </div>
        {/* Group Selector */}
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="group-select-label">Select Group</InputLabel>
          <Select
            labelId="group-select-label"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            label="Select Group"
            disabled={loading}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Navigate Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNavigate}
          disabled={!selectedGroup || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Go to Documents"}
        </Button>
      </div>
    </div>
  );
};

export default GroupSelector;
