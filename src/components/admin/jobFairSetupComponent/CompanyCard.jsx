import React from 'react';
import { MapPin, Calendar, Check, X, Mail, Phone, Globe, FileText } from 'lucide-react';

const CompanyCard = ({ participation, onApprove, onReject, onViewDetails, processing }) => {
  const company = participation.company;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = (size) => {
    switch (size?.toLowerCase()) {
      case 'large': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'small': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
        <div className="flex items-center gap-3">
          <img
            src={company.profile_image}
            alt={`${company.name} logo`}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
            <p className="text-gray-600 text-sm">{company.industry}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participation.status)}`}>
            {participation.status.charAt(0).toUpperCase() + participation.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSizeColor(company.size)}`}>
            {company.size?.charAt(0).toUpperCase() + company.size?.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center"><MapPin size={16} className="mr-2" />{company.location}</div>
          <div className="flex items-center"><Calendar size={16} className="mr-2" />Applied: {formatDate(participation.submitted_at)}</div>
          {participation.reviewed_at && (
            <div className="flex items-center"><Check size={16} className="mr-2" />Reviewed: {formatDate(participation.reviewed_at)}</div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>

        <div className="space-y-1 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-2"><Mail size={12} /><span>{company.contact_email}</span></div>
          <div className="flex items-center gap-2"><Phone size={12} /><span>{company.contact_phone}</span></div>
          {company.website && (
            <div className="flex items-center gap-2">
              <Globe size={12} />
              <a href={company.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </div>
          )}
        </div>

        {participation.special_requirements && (
          <div className="bg-yellow-50 p-2 rounded mb-4 text-xs text-yellow-800">
            <strong>Special Requirements:</strong> {participation.special_requirements}
          </div>
        )}

        {participation.need_branding && (
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              Needs Branding
            </span>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onViewDetails(participation.id)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            <FileText size={14} />
            Details
          </button>

          {participation.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(participation.id)}
                disabled={processing}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded transition-colors"
              >
                <Check size={14} />
                {processing ? 'Approving...' : 'Approve'}
              </button>

              <button
                onClick={() => onReject(participation.id, company.id)} 
                disabled={processing}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded transition-colors"
              >
                <X size={14} />
                {processing ? 'Rejecting...' : 'Reject'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
