import { useState } from 'react';

const CompanyRow = ({ company, onView, onApproveReject, actionLoading }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusStyle = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusLabel = status => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  };

  // Correctly determine the status
  const status =
    company.status === 'approved'
      ? 'approved'
      : company.status === 'pending'
      ? 'pending'
      : 'rejected';

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      onApproveReject(company.id, 'reject', rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {company.logo_path ? (
              <img
                className="h-10 w-10 rounded-full"
                src={company.logo_path}
                alt={company.name}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="ml-4">
              <div className="font-medium text-gray-900">{company.name}</div>
              <div className="text-sm text-gray-500">{company.location}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{company.contact_email}</div>
          <div className="text-sm text-gray-500">{company.contact_phone}</div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{company.industry}</td>
        
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusStyle(status)}`}
          >
            {getStatusLabel(status)}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {status === 'approved' || status === 'rejected' ? (
              <button 
                onClick={() => onView(company)} 
                className="cursor-pointer text-center text-(--primary-600) " 
                title="View Details"
              >
                View
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApproveReject(company.id, 'approve')}
                  disabled={actionLoading === `${company.id}-approve`}
                  className="text-green-600 hover:text-green-800 disabled:opacity-50"
                  title="Approve"
                >
                  {actionLoading === `${company.id}-approve` ? '⏳' : 'Approve'}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={actionLoading === `${company.id}-reject`}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  title="Reject"
                >
                  {actionLoading === `${company.id}-reject` ? '⏳' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Reject Company: {company.name}
              </h3>
              <button
                onClick={handleRejectCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                {company.logo_path ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={company.logo_path}
                    alt={company.name}
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {company.name}
                  </h4>
                  <p className="text-sm text-gray-600">{company.location}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this company:
              </p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2  resize-none"
                rows="4"
                required
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleRejectCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
                className="cursor-pointer bg-(--primary-600) text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Company
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyRow;