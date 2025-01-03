import React from 'react';
import type { NextPage } from 'next';

import { getRandomColor } from '@/utils';

interface ShelfProps {
  groups: string[];
  handleGroupSelect: (group: string) => void;
}

const Shelf: NextPage<ShelfProps> = ({ groups, handleGroupSelect }) => {
  const books = groups.map((group) => {
    return {
      id: group.toLowerCase(),
      title: group,
      color: getRandomColor(),
    };
  });

  const handleBookClick = (id: string) => {
    handleGroupSelect(id);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 h-auto">
      <div className="flex flex-wrap gap-4 justify-center max-w-5xl">
        {books.map((book) => (
          <div
            key={book.id}
            className={`flex justify-center items-center w-36 h-48 text-white font-bold text-lg rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl ${book.color}`}
            onClick={() => handleBookClick(book.title)}
          >
            {book.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
