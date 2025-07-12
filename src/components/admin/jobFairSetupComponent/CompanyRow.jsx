'use client';

import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Check,
  X,
  Mail,
  Phone,
  Globe,
  FileText,
  Building2,
} from 'lucide-react';
import RejectReasonModal from './RejectModal';

const CompanyRow = ({
  participation,
  handleAction,
  onViewDetails,
  processing,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const openRejectModal = () => setShowModal(true);
  const closeRejectModal = () => {
    setShowModal(false);
    setRejectReason('');
  };

  const handleSubmitReason = () => {
    handleAction({
      participationId: participation.id,
      companyId: company.id,
      action: 'rejected',
      reason: rejectReason,
    });
    closeRejectModal();
  };

  const company = participation.company;

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = size => {
    switch (size?.toLowerCase()) {
      case 'large':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'small':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = dateStr =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Company Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12">
              {company.logo_path ? (
                <img
                  className="h-12 w-12 rounded-lg object-cover"
                  src={company.logo_path || '/placeholder.svg'}
                  alt={`${company.name} logo`}
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {company.name}
              </div>
              <div className="flex gap-2 mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSizeColor(company.size)}`}
                >
                  {company.size}
                </span>
                {participation.need_branding && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Needs Branding
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Industry Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{company.industry}</div>
        </td>

        {/* Location Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900">
            <MapPin size={14} className="mr-1 text-gray-400" />
            {company.location}
          </div>
        </td>

        {/* Status Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participation.status)}`}
          >
            {participation.status.charAt(0).toUpperCase() +
              participation.status.slice(1)}
          </span>
        </td>

        {/* Applied Date Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900">
            <Calendar size={14} className="mr-1 text-gray-400" />
            {formatDate(participation.submitted_at)}
          </div>
          {participation.reviewed_at && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Check size={12} className="mr-1" />
              Reviewed: {formatDate(participation.reviewed_at)}
            </div>
          )}
        </td>

        {/* Contact Column */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600">
              <Mail size={12} className="mr-1" />
              <span className="truncate max-w-32">{company.contact_email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Phone size={12} className="mr-1" />
              <span>{company.contact_phone}</span>
            </div>
            {company.website && (
              <div className="flex items-center text-xs">
                <Globe size={12} className="mr-1 text-gray-400" />
                <a
                  href={company.website}
                  className="text-blue-600 hover:underline truncate max-w-32"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </div>
            )}
          </div>
        </td>

        {/* Actions Column */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewDetails(participation.id)}
              className="inline-flex items-center px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              <FileText size={12} className="mr-1" />
              Details
            </button>

            {participation.status === 'pending' && (
              <>
                <button
                  disabled={processing}
                  className="inline-flex items-center px-2 py-1 text-xs text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded transition-colors"
                  onClick={() =>
                    handleAction({
                      participationId: participation.id,
                      companyId: company.id,
                      action: 'approved',
                    })
                  }
                >
                  <Check size={12} className="mr-1" />
                  {processing ? 'Approving...' : 'Approve'}
                </button>

                <button
                  disabled={processing}
                  className="inline-flex items-center px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded transition-colors"
                  onClick={openRejectModal}
                >
                  <X size={12} className="mr-1" />
                  {processing ? 'Rejecting...' : 'Reject'}
                </button>
              </>
            )}
          </div>
        </td>
      </tr>

      <RejectReasonModal
        isOpen={showModal}
        onClose={closeRejectModal}
        onSubmit={handleSubmitReason}
        reason={rejectReason}
        setReason={setRejectReason}
      />
    </>
  );
};

export default CompanyRow;
