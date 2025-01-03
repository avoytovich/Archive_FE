'use client';

import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';

import AddNewGroup from '@/components/AddNewGroup';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { useServices } from '@/services';
import { handleNavigate, handleError } from '@/utils';

const Shelf = lazy(() => import('@/components/Shelf'));

const Library: React.FC = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { fetchGroups } = useServices();

  useEffect(() => {
    const fetchGroupsList = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error: unknown) {
        handleError(error, 'Error fetching groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsList();
  }, [fetchGroups]);

  const handleGroupSelect = useCallback(
    (group: string) => {
      handleNavigate(router, `/documents?group=${group}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold mb-4">Library</h1>
          <AddNewGroup groups={groups} isFetchingGroups={loading} />
        </div>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Suspense fallback={<LoadingIndicator />}>
            <Shelf groups={groups} handleGroupSelect={handleGroupSelect} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Library;
