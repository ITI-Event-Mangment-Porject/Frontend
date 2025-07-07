// CompanyGrid.jsx
import React from 'react';
import CompanyCard from './CompanyCard';

const CompanyGrid = ({
  companies,
  searchTerm,
  statusFilter,
  onApprove,
  onReject,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCompanies.map((participation) => (
        <CompanyCard
          key={participation.id}
          participation={participation}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={onViewDetails}
          processing={processingIds.has(participation.id)}
        />
      ))}
    </div>
  );
};

export default CompanyGrid;
