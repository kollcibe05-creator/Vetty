import React from 'react';
import { useSelector } from 'react-redux';
import { selectSpinner } from '../features/uiSlice';

const Spinner = () => {
  const { isLoading, message } = useSelector(selectSpinner);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Spinner;
