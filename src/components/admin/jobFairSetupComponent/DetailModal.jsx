// DetailModal.jsx
import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Check,
  AlertCircle,
} from 'lucide-react';

const DetailModal = ({
  details,
  onClose,
  onApprove,
  onReject,
  processingIds,
}) => {
  if (!details) return null;

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
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Company Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={details.company.profile_image}
              alt={`${details.company.name} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{details.company.name}</h3>
              <p className="text-gray-600">{details.company.industry}</p>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(details.status)}`}
                >
                  {details.status.charAt(0).toUpperCase() +
                    details.status.slice(1)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSizeColor(details.company.size)}`}
                >
                  {details.company.size?.charAt(0).toUpperCase() +
                    details.company.size?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <InfoRow
                  icon={<Mail size={16} />}
                  text={details.company.contact_email}
                />
                <InfoRow
                  icon={<Phone size={16} />}
                  text={details.company.contact_phone}
                />
                <InfoRow
                  icon={<MapPin size={16} />}
                  text={details.company.location}
                />
                {details.company.website && (
                  <InfoRow
                    icon={<Globe size={16} />}
                    text={
                      <a
                        href={details.company.website}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {details.company.website}
                      </a>
                    }
                  />
                )}
              </div>
            </div>

            {/* Participation Info */}
            <div>
              <h4 className="font-medium mb-2">Participation Details</h4>
              <div className="space-y-2 text-sm">
                <InfoRow
                  icon={<Calendar size={16} />}
                  text={`Applied: ${formatDate(details.submitted_at)}`}
                />
                {details.reviewed_at && (
                  <InfoRow
                    icon={<Check size={16} />}
                    text={`Reviewed: ${formatDate(details.reviewed_at)}`}
                  />
                )}
                {details.need_branding && (
                  <InfoRow
                    icon={<AlertCircle size={16} className="text-purple-500" />}
                    text={
                      <span className="text-purple-600">Needs Branding</span>
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Company Description</h4>
            <p className="text-sm text-gray-600">
              {details.company.description}
            </p>
          </div>

          {/* Special Requirements */}
          {details.special_requirements && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Special Requirements</h4>
              <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm">
                {details.special_requirements}
              </div>
            </div>
          )}

          {/* Approve Button */}
          {details.status === 'pending' && (
            <div className="flex justify-end pt-4 gap-3 border-t">
              <button
                onClick={() => {
                  onApprove(details.id);
                  onClose();
                }}
                disabled={processingIds.has(details.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                <Check size={16} />
                {processingIds.has(details.id) ? 'Approving...' : 'Approve'}
              </button>

              <button
                onClick={() => {
                  onReject(details.id);
                  onClose();
                }}
                disabled={processingIds.has(details.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                <Check size={16} />
                {processingIds.has(details.id) ? 'Rejected...' : 'Reject'}
              </button>

              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </div>
);

export default DetailModal;
