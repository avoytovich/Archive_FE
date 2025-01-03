import toast from 'react-hot-toast';

interface Router {
  push: (url: string) => void;
}

export const handleNavigate = (router: Router, url: string) => {
  router.push(url);
};

export const handleError = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    toast.error(error.message || message || 'An unexpected error occurred');
  }
};

export const getRandomColor = () => {
  const colors = [
    'bg-red-800',
    'bg-green-800',
    'bg-blue-800',
    'bg-yellow-800',
    'bg-purple-800',
    'bg-pink-800',
    'bg-indigo-800',
    'bg-teal-800',
    'bg-orange-800',
    'bg-lime-800',
    'bg-cyan-800',
    'bg-amber-800',
    'bg-emerald-800',
    'bg-fuchsia-800',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
