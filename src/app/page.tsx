'use client';

import React, { useEffect, useState, useCallback } from 'react';

import { useServices } from '@/services';
import AddNewGroup from '@/components/AddNewGroup';
import GroupSelect from '@/components/GroupSelect';
import NavigateButton from '@/components/NavigateButton';

const GroupSelector: React.FC = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchGroups } = useServices();

  useEffect(() => {
    const fetchGroupsList = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Failed to fetch groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsList();
  }, [fetchGroups]);

  const handleGroupSelect = useCallback((group: string) => {
    setSelectedGroup(group);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold mb-4">Select a Group</h1>
          <AddNewGroup groups={groups} />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <GroupSelect
          groups={groups}
          selectedGroup={selectedGroup}
          handleGroupSelect={handleGroupSelect}
          loading={loading}
        />
        <NavigateButton selectedGroup={selectedGroup} loading={loading} />
      </div>
    </div>
  );
};

export default GroupSelector;
