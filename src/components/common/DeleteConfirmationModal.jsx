import React from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({ object, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-in-out]">
      <div className="bg-white rounded-lg p-6 w-auto shadow-xl transform transition-all animate-[modalIn_0.3s_ease-out]">
        <div className="flex items-center mb-4 text-red-500">
          <FaExclamationTriangle className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-medium">Confirm Deletion</h3>
        </div>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {object?.first_name
              ? `${object.first_name} ${object.last_name}`
              : object?.title || 'this item'}
          </span>
          ?
          <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(object)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
          >
            <FaTrash className="w-3 h-3 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
