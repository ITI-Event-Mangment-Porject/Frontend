import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import Filters from './Filters';
import CompanyTable from './CompanyTable';
import CompanyModal from './CompanyModal';
import Pagination from './Pagination';
import FullPageLoader from '../../FullPageLoader';

const JobFairSetUp = () => {
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [approvedCompanies, setApprovedCompanies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
    links: [],
  });

  const fetchCompanies = async (
    url = 'http://localhost:8000/api/companies?sort=-created_at&per_page=10'
  ) => {
    try {
      setLoading(true);
      let finalUrl = url;
      if (searchTerm) finalUrl += `&filter[name]=${searchTerm}`;
      if (statusFilter === 'approved') finalUrl += `&filter[is_approved]=1`;
      if (statusFilter === 'rejected') finalUrl += `&filter[is_approved]=0`;

      const res = await fetch(finalUrl);
      const data = await res.json();

      setCompanies(data.data.companies.data);
      setTotalCompanies(data.data.total_count);
      setApprovedCompanies(data.data.approved_count);
      setPagination({
        current_page: data.data.companies.current_page,
        last_page: data.data.companies.last_page,
        next_page_url: data.data.companies.next_page_url,
        prev_page_url: data.data.companies.prev_page_url,
        links: data.data.companies.links,
      });
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter]);

  const handleSearch = e => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleApproveReject = async (companyId, action) => {
    try {
      setActionLoading(`${companyId}-${action}`);
      const response = await fetch(
        `http://localhost:8000/api/companies/${companyId}/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.ok) {
        fetchCompanies();
        console.log(`Company ${action}d successfully`);
      } else {
        console.error(`Failed to ${action} company`);
      }
    } catch (err) {
      console.error(`Error ${action}ing company:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const totalSlots = companies.reduce(
    (acc, c) => acc + c.interview_requests_count,
    0
  );
  const totalFilled = companies.reduce(
    (acc, c) => acc + c.filled_interviews_count,
    0
  );

  if (loading) {
    <FullPageLoader loading={loading} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="font-bold text-3xl mb-6">Job Fair Setup</div>
      <div className="grid grid-cols-1 mb-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Companies" value={totalCompanies} icon="🏢" />
        <StatCard
          title="Approved Companies"
          value={approvedCompanies}
          icon="✅"
        />
        <StatCard title="Total Slots" value={totalSlots} icon="🗓️" />
        <StatCard title="Filled Slots" value={totalFilled} icon="📌" />
      </div>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={handleSearch}
        onRefresh={() => fetchCompanies()}
      />

      <CompanyTable
        companies={companies}
        loading={loading}
        onView={company => {
          setSelectedCompany(company);
          setShowModal(true);
        }}
        onApproveReject={handleApproveReject}
        actionLoading={actionLoading}
      />

      <Pagination
        pagination={pagination}
        onPageChange={fetchCompanies}
        totalCompanies={totalCompanies}
      />

      {showModal && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default JobFairSetUp;
