'use client';
import CompanyRow from './CompanyRow';

const CompanyTable = ({
  companies,
  searchTerm,
  statusFilter,
  handleAction,
  onViewDetails,
  processingIds,
}) => {
  const filteredCompanies = companies.filter(({ company, status }) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Statuses' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (filteredCompanies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No companies found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map(participation => (
              <CompanyRow
                key={participation.id}
                participation={participation}
                handleAction={handleAction}
                onViewDetails={onViewDetails}
                processing={processingIds.has(participation.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;
