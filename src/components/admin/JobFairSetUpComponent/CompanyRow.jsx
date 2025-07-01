const CompanyRow = ({ company, onView, onApproveReject, actionLoading }) => {
  const getStatusStyle = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusLabel = (status) => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    return 'Pending';
  };

  const status = company.is_approved == 1
    ? 'approved'
    : company.is_approved == 0
    ? 'rejected'
    : 'pending';

  const progress = company.interview_requests_count > 0
    ? (company.filled_interviews_count / company.interview_requests_count) * 100
    : 0;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {company.logo_path ? (
            <img className="h-10 w-10 rounded-full" src={company.logo_path} alt={company.name} />
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
        <div className="text-sm text-gray-900">
          {company.filled_interviews_count} / {company.interview_requests_count}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-red-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full  ${getStatusStyle(status)}`}>
          {getStatusLabel(status)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {status === 'approved' ? (
            <button onClick={() => onView(company)} className="text-red-600 hover:text-red-800" title="View Details">
              view
            </button>
          ) : (
            <>
              <button
                onClick={() => onApproveReject(company.id, 'approve')}
                disabled={actionLoading === `${company.id}-approve`}
                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                title="Approve"
              >
                {actionLoading === `${company.id}-approve` ? '⏳' : '✔️'}
              </button>
              <button
                onClick={() => onApproveReject(company.id, 'reject')}
                disabled={actionLoading === `${company.id}-reject`}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                title="Reject"
              >
                {actionLoading === `${company.id}-reject` ? '⏳' : '❌'}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CompanyRow;
