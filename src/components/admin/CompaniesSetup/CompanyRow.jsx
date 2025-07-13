'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const CompanyRow = ({ company, onView, onApproveReject, actionLoading }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusStyle = status => {
    if (status === 'approved')
      return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getStatusLabel = status => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  };

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
      <tr className="hover:bg-gray-50 transition-colors duration-200">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {company.logo_path && (
              <img
                src={`${company.logo_path}`}
                alt={company.name}
                className="w-24 h-24 object-cover rounded-full"
              />
            )}

            <div className="ml-4">
              <div className="font-bold text-gray-900 text-lg">
                {company.name}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {company.location}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">
            {company.contact_email}
          </div>
         
          <div className="text-sm text-gray-600 font-medium">
            {company.contact_phone}
          </div>
         
        </td>
        <td className="px-6 py-4">
          <span className="px-3 py-1 bg-[#203947]/10 text-[#203947] rounded-full text-sm font-semibold">
            {company.industry}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-2 inline-flex text-sm font-bold rounded-full border-2 ${getStatusStyle(status)}`}
          >
            {getStatusLabel(status)}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            {status === 'approved' || status === 'rejected' ? (
              <button
                onClick={() => onView(company)}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                title="View Details"
              >
                View Details
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => onApproveReject(company.id, 'approve')}
                  disabled={actionLoading === `${company.id}-approve`}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  title="Approve"
                >
                  {actionLoading === `${company.id}-approve` ? '⏳' : 'Approve'}
                </button>
                <button
                  onClick={handleRejectClick}
                  disabled={actionLoading === `${company.id}-reject`}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  title="Reject"
                >
                  {actionLoading === `${company.id}-reject` ? '⏳' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Enhanced Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-up">
            <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-6 text-white rounded-t-2xl">
              <button
                onClick={handleRejectCancel}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-2">Reject Company</h3>
              <p className="text-white/90">Provide a reason for rejection</p>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                {company.logo_path ? (
                  <img
                    className="h-12 w-12 rounded-xl object-cover shadow-lg"
                    src={company.logo_path || '/placeholder.svg'}
                    alt={company.name}
                  />
                ) : (
                  <div className="h-12 w-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center text-white font-bold">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    {company.name}
                  </h4>
                 
                  <p className="text-sm text-gray-600 font-medium">
                    {company.location}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Enter detailed reason for rejecting this company..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 resize-none text-sm"
                  rows="4"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRejectCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                >
                  Reject Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyRow;
