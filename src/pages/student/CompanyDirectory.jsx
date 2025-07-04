import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState({
    industry: 'All',
    size: 'All',
    is_approved: 'All',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCompanies(res.data || []))
      .catch(err => console.error('Error fetching companies:', err));
  }, []);

  // Get unique industries and sizes for filter dropdowns
  const industries = useMemo(
    () => [
      'All',
      ...Array.from(new Set(companies.map(c => c.industry).filter(Boolean))),
    ],
    [companies]
  );
  const sizes = useMemo(
    () => [
      'All',
      ...Array.from(new Set(companies.map(c => c.size).filter(Boolean))),
    ],
    [companies]
  );

  const filtered = useMemo(() => {
    return companies.filter(c => {
      return (
        (filters.industry === 'All' || c.industry === filters.industry) &&
        (filters.size === 'All' || c.size === filters.size) &&
        (filters.is_approved === 'All' ||
          (filters.is_approved === 'Approved' ? c.is_approved : !c.is_approved))
      );
    });
  }, [companies, filters]);

  const company = filtered[selected] || {};

  return (
    <Layout>
      <div className="flex-1 p-4 flex flex-col lg:flex-row gap-6">
        {/* Sidebar: Filters and Company List */}
        <div className="lg:w-96 w-full space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Filters ({filtered.length})</h3>
            <div className="space-y-2">
              <select
                className="w-full border rounded px-2 py-1 text-sm"
                value={filters.industry}
                onChange={e =>
                  setFilters(f => ({ ...f, industry: e.target.value }))
                }
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <select
                className="w-full border rounded px-2 py-1 text-sm"
                value={filters.size}
                onChange={e =>
                  setFilters(f => ({ ...f, size: e.target.value }))
                }
              >
                {sizes.map(sz => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
              <select
                className="w-full border rounded px-2 py-1 text-sm"
                value={filters.is_approved}
                onChange={e =>
                  setFilters(f => ({ ...f, is_approved: e.target.value }))
                }
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button
              className="w-full mt-3 text-sm border-2 border-dashed border-gray-300 rounded-lg py-2 hover:bg-gray-50"
              onClick={() =>
                setFilters({
                  industry: 'All',
                  size: 'All',
                  is_approved: 'All',
                })
              }
            >
              🗑️ Clear All Filters
            </button>
          </div>

          {/* Companies List */}
          <div className="bg-white rounded-lg shadow divide-y">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No companies found.
              </div>
            ) : (
              filtered.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-orange-50 ${
                    selected === i
                      ? 'border-l-4 border-orange-500 bg-orange-50'
                      : ''
                  }`}
                  onClick={() => setSelected(i)}
                >
                  <img
                    src={
                      c.logo_path ||
                      'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(c.name)
                    }
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover bg-orange-100"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">
                      {c.industry} · {c.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {company && company.name ? (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                <img
                  src={
                    company.logo_path ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(company.name)
                  }
                  alt={company.name}
                  className="w-20 h-20 rounded-lg object-cover bg-orange-100"
                />
                <div>
                  <h1 className="font-bold text-2xl">{company.name}</h1>
                  <div className="text-sm text-gray-500">
                    {company.industry} · {company.size} · {company.location}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                    {company.contact_email && (
                      <a
                        href={`mailto:${company.contact_email}`}
                        className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                      >
                        📧 Get Contact
                      </a>
                    )}
                    {company.website && (
                      <a
                        href={
                          company.website.startsWith('http')
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition"
                      >
                        🌐 Website
                      </a>
                    )}
                    {company.contact_phone && (
                      <a
                        href={`tel:${company.contact_phone}`}
                        className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                      >
                        📞 Call
                      </a>
                    )}
                    {company.linkedin_url && (
                      <a
                        href={company.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300 transition"
                      >
                        💼 LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Description</h4>
                  <p className="text-sm text-gray-600">
                    {company.description || 'No description available.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Approval Status</h4>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      company.is_approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {company.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">
              Select a company to view details.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default CompanyDirectory;
