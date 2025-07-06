const CompanyModal = ({ company, onClose }) => {
  const getStatusStyle = isApproved =>
    isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
          <button
            onClick={onClose}
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
                className="h-16 w-16 rounded-full"
                src={company.logo_path}
                alt={company.name}
              />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xl">
                  {company.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h4 className="text-xl font-semibold text-gray-900">
                {company.name}
              </h4>
              <p className="text-gray-600">{company.location}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Description: {company.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">
                Contact Information
              </h5>
              <p className="text-sm text-gray-600">
                Email: {company.contact_email}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {company.contact_phone}
              </p>
              <p className="text-sm text-gray-600">
                Location: {company.location}
              </p>
              <div className="flex gap-2 mt-3">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-(--primary-600) text-white px-4 py-2 rounded-lg "
                >
                  Website
                </a>
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Company Info</h5>
              <p className="text-sm text-gray-600">
                Industry: {company.industry}
              </p>
              <p className="text-sm text-gray-600">
                Status:
                <span
                  className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusStyle(company.is_approved)}`}
                >
                  {company.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </p>
              <p className="text-sm text-gray-600">Size: {company.size}</p>
            </div>

            {company.status !== 'rejected' && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Interview Slots
                </h5>
                <p className="text-sm text-gray-600">
                  Total Slots: {company.interview_requests_count}
                </p>
                <p className="text-sm text-gray-600">
                  Filled Slots: {company.filled_interviews_count}
                </p>
              </div>
            )}
          </div>
          {company.reason !== null && (
            <div className="my-2">
              <h1 className="text-(--primary-600) font-semibold">
                Reason for rejection :{' '}
                <span className="text-gray-600 text-sm">{company.reason}</span>
              </h1>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
