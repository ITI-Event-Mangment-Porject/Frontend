import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import Filters from './Filters';
import CompanyTable from './CompanyTable';
import CompanyModal from './CompanyModal';
import Pagination from './Pagination';

import FullPageLoader from '../../FullPageLoader';
import { companyAPI } from '../../../services/api';


const CompaniesSetUp = () => {
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
  const [showAddForm, setShowAddform] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    linkedin_url: '',
  });

  const fetchCompanies = async (url = null) => {
    try {
      setLoading(true);

      // Prepare query parameters
      const params = {
        sort: '-created_at',
        per_page: 10,
      };

      // Add filters if they exist
      if (searchTerm) params['filter[name]'] = searchTerm;
      if (statusFilter === 'approved') params['filter[status]'] = 'approved';
      if (statusFilter === 'rejected') params['filter[status]'] = 'rejected';
      if(statusFilter === 'pending') params['filter[status]'] = 'pending';

      // If a specific URL is provided (for pagination), extract page number
      if (url) {
        const pageMatch = url.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) {
          params.page = pageMatch[1];
        }
      }

      const response = await companyAPI.getAll(params);
      const data = response.data;

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

  const handleAddCompany = async e => {
    e.preventDefault();
    try {
      const response = await companyAPI.create(newCompany);

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        const newCompanyData = {
          ...data.data[0], // Extract the new company data
          status: data.data.status, // Include the "status" field
        };

        // Update the UI with the new company
        setCompanies(prevCompanies => [newCompanyData, ...prevCompanies]);
        setShowAddform(false);
        setNewCompany({
          name: '',
          email: '',
          phone: '',
          address: '',
          contact_email: '',
          contact_phone: '',
          location: '',
          description: '',
          website: '',
          industry: '',
          size: '',
          linkedin_url: '',
        });
        console.log('Company added successfully');
      } else {
        console.error('Failed to add company');
      }
    } catch (err) {
      console.error('Error adding company:', err);
    }
  };

  const handleApproveReject = async (companyId, action, reason = null) => {
    try {
      setActionLoading(`${companyId}-${action}`);

      let response;
      if (action === 'approve') {
        response = await companyAPI.approve(companyId);
      } else if (action === 'reject') {
        response = await companyAPI.reject(companyId, reason);
      }

      if (response.status === 200) {
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Companies data...</p>
        </div>
      </div>
    );

  }

  return (
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
      <div className="container  mx-auto px-4 py-6">
        <div className="flex justify-between align-items-center mb-6">
          <div className="font-bold text-3xl mb-6">Companies SetUp</div>
          <div>
            <button
              onClick={() => setShowAddform(true)}
              className="bg-(--primary-600)  cursor-pointer text-white font-semibold px-8 py-2 rounded-lg"
            >
              Add New Company
            </button>
          </div>
        </div>
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Company</h2>
            <form onSubmit={handleAddCompany}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={e =>
                    setNewCompany({ ...newCompany, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newCompany.email}
                  onChange={e =>
                    setNewCompany({ ...newCompany, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={newCompany.phone}
                  onChange={e =>
                    setNewCompany({ ...newCompany, phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newCompany.address}
                  onChange={e =>
                    setNewCompany({ ...newCompany, address: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newCompany.contact_email}
                  onChange={e =>
                    setNewCompany({
                      ...newCompany,
                      contact_email: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={newCompany.contact_phone}
                  onChange={e =>
                    setNewCompany({
                      ...newCompany,
                      contact_phone: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newCompany.location}
                  onChange={e =>
                    setNewCompany({ ...newCompany, location: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCompany.description}
                  onChange={e =>
                    setNewCompany({
                      ...newCompany,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={newCompany.website}
                  onChange={e =>
                    setNewCompany({ ...newCompany, website: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={newCompany.industry}
                  onChange={e =>
                    setNewCompany({ ...newCompany, industry: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={newCompany.size}
                  onChange={e =>
                    setNewCompany({ ...newCompany, size: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (1-50 employees)</option>
                  <option value="medium">Medium (51-200 employees)</option>
                  <option value="large">Large (200+ employees)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={newCompany.linkedin_url}
                  onChange={e =>
                    setNewCompany({
                      ...newCompany,
                      linkedin_url: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddform(false)} // Hide the form
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-(--primary-600) text-white px-4 py-2 rounded-lg"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        )}
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
    </div>
  );
};

export default CompaniesSetUp;
