
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import Filters from './Filters';
import CompanyTable from './CompanyTable';
import CompanyModal from './CompanyModal';
import Pagination from './Pagination';

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
    logo_path: null,
  });
  const [errors, setErrors] = useState({});

  const validateCompanyForm = () => {
    const newErrors = {};
    if (!newCompany.name.trim())
      newErrors.name = 'Please Enter Name of Your Company';
    if (!newCompany.description.trim())
      newErrors.description = 'Please Enter Company Description';
    if (!newCompany.contact_email.trim())
      newErrors.contact_email = 'Please Enter Your Contact Email';
    else if (!/^\S+@\S+\.\S+$/.test(newCompany.contact_email))
      newErrors.contact_email = 'Please Enter a Valid Email Address';
    if (!newCompany.contact_phone.trim())
      newErrors.contact_phone = 'Please Enter Your Contact Phone Number';
    else if (
      !/^(\+20|0020|20)?(01[0-9]{9}|0[2-9][0-9]{7,8})$/.test(
        newCompany.contact_phone
      )
    )
      newErrors.contact_phone = 'Please Enter a Valid Egyptian Phone Number';
    if (newCompany.website && !/^https?:\/\/.+\..+$/.test(newCompany.website))
      newErrors.website = 'Please Enter a Valid Website URL';
    if (
      newCompany.linkedin_url &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(newCompany.linkedin_url)
    )
      newErrors.linkedin_url = 'Please Enter a Valid LinkedIn URL';
    if (
      newCompany.size &&
      !['startup', 'small', 'medium', 'large', 'enterprise'].includes(
        newCompany.size
      )
    )
      newErrors.size =
        'Company size must be one of: startup, small, medium, large, enterprise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCompanies = async (url = null) => {
    try {
      setLoading(true);
      const params = { sort: '-created_at', per_page: 10 };
      if (searchTerm) params['filter[name]'] = searchTerm;
      if (statusFilter !== 'all') params['filter[status]'] = statusFilter;
      if (url) {
        const pageMatch = url.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) params.page = pageMatch[1];
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
    if (!validateCompanyForm()) return;

    const formData = new FormData();
    for (const key in newCompany) {
      if (newCompany[key]) {
        formData.append(key, newCompany[key]);
      }
    }

    try {
      const response = await companyAPI.create(formData); // must support multipart/form-data in the API
      if ([200, 201].includes(response.status)) {
        fetchCompanies();
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
          logo_path: null,
        });
        setErrors({});
        console.log('Company added successfully');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors;
        const mapped = {};
        for (const key in backendErrors) {
          mapped[key] = backendErrors[key][0];
        }
        setErrors(mapped);
      } else {
        console.error('Error adding company:', err);
      }
    }
  };

  const handleApproveReject = async (companyId, action, reason = null) => {
    try {
      setActionLoading(`${companyId}-${action}`);
      const response =
        action === 'approve'
          ? await companyAPI.approve(companyId)
          : await companyAPI.reject(companyId, reason);
      if (response.status === 200) fetchCompanies();
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
    <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col border border-[var(--gray-200)] rounded-lg shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between mb-6">
          <h1 className="font-bold text-3xl">Companies SetUp</h1>
          <button
            onClick={() => setShowAddform(true)}
            className="bg-(--primary-600) text-white font-semibold px-8 py-2 rounded-lg"
          >
            Add New Company
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddCompany}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-xl font-bold mb-4">Add New Company</h2>
            {[
              'name',
              'description',
              'contact_email',
              'contact_phone',
              'website',
              'linkedin_url',
              'industry',
              'location',
              'address',
            ].map(field => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type={
                    field.includes('email')
                      ? 'email'
                      : field.includes('url')
                        ? 'url'
                        : 'text'
                  }
                  value={newCompany[field] || ''}
                  onChange={e =>
                    setNewCompany({ ...newCompany, [field]: e.target.value })
                  }
                  className={`w-full p-3 border rounded-lg ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                value={newCompany.size}
                onChange={e =>
                  setNewCompany({ ...newCompany, size: e.target.value })
                }
                className={`w-full p-3 border rounded-lg ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select size</option>
                <option value="startup">Startup</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="enterprise">Enterprise</option>
              </select>
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  setNewCompany({ ...newCompany, logo_path: e.target.files[0] })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddform(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-(--primary-600) text-white px-4 py-2 rounded-lg"
              >
                Add Company
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 mb-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Companies" value={totalCompanies} />
          <StatCard title="Approved Companies" value={approvedCompanies} />
          <StatCard title="Total Slots" value={totalSlots} />
          <StatCard title="Filled Slots" value={totalFilled} />
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
