import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showFooter = true,
  primaryButtonText = 'Save',
  secondaryButtonText = 'Cancel',
  onPrimaryAction,
  isSubmitting = false,
}) => {
  useEffect(() => {
    const handleEscapeKey = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };

  const modalSize = sizeClasses[size] || sizeClasses.md;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      {/* Background overlay with blur only */}
      <div
        className="fixed inset-0 backdrop-blur-md transition-all duration-300 animate-fadeIn"
        style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen p-4 ">
        {/* Modal panel */}
        <div
          className={`relative bg-white rounded-2xl shadow-2xl ${modalSize} w-full max-h-[90vh] overflow-hidden animate-scaleIn`}
          style={{
            animation:
              'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
          onClick={e => e.stopPropagation()}
        >
          {' '}
          {/* Header */}
          <div
            className="flex justify-between items-center p-6 pb-4 animate-slideInDown"
            style={{ animation: 'slideInDown 0.4s ease-out forwards' }}
          >
            <h2 className="text-xl font-semibold text-gray-900 text-left">
              {title}
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          {/* Content */}
          <div
            className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)] text-left animate-fadeIn"
            style={{
              animation: 'fadeIn 0.5s ease-out forwards',
              animationDelay: '0.1s',
            }}
          >
            {children}
          </div>
          {/* Footer */}
          {showFooter && (
            <div
              className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl animate-slideInUp"
              style={{
                animation: 'slideInUp 0.4s ease-out forwards',
                animationDelay: '0.2s',
              }}
            >
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {secondaryButtonText}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium text-[var(--gray-900)] bg-[var(--secondary-500)] border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={onPrimaryAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Loading...' : primaryButtonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
