import toast from 'react-hot-toast';

interface Router {
  push: (url: string) => void;
}

export const handleNavigate = (router: Router, selectedGroup: string) => {
  if (!selectedGroup) {
    alert('Please select a group first.');
    return;
  }
  router.push(`/documents?group=${selectedGroup}`);
};

export const handleError = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    toast.error(error.message || message || 'An unexpected error occurred');
  }
};
