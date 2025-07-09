// CompanyDirectory.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';
const JOB_FAIR_ID = 1;

const ImageWithFallback = ({ src, alt, className, fallbackText }) => {
  const [hasError, setHasError] = useState(false);

  const createPlaceholderSVG = (text) => {
    const initials = text.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f97316"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="25" font-weight="bold">${initials}</text>
      </svg>`
    )}`;
  };

  if (!src || src.includes('via.placeholder.com') || hasError) {
    return <img src={createPlaceholderSVG(fallbackText || alt || 'Company')} alt={alt} className={className} />;
  }

  return <img src={src} alt={alt} onError={() => setHasError(true)} className={className} />;
};

const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState({ industry: 'All', jobTitle: 'All' });
  const [allJobProfiles, setAllJobProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [registeringJobs, setRegisteringJobs] = useState(new Set());
  const [appliedProfiles, setAppliedProfiles] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCompanies(res.data?.data?.companies?.data || []);
      })
      .catch(err => {
        console.error('Error fetching companies:', err);
        toast.error('Failed to load companies');
      });
  }, []);

  useEffect(() => {
    const fetchJobProfiles = async () => {
      setLoadingProfiles(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/job-fairs/${JOB_FAIR_ID}/job-profiles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllJobProfiles(response.data?.data?.job_profiles || []);
      } catch (error) {
        console.error('Error fetching job profiles:', error);
        toast.error('Failed to load job profiles');
        setAllJobProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchJobProfiles();
  }, []);

  const industries = useMemo(() => ['All', ...Array.from(new Set(companies.map(c => c.industry).filter(Boolean)))], [companies]);
  const jobTitles = useMemo(() => ['All', ...Array.from(new Set(allJobProfiles.map(p => p.title).filter(Boolean)))], [allJobProfiles]);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchesIndustry = filters.industry === 'All' || c.industry === filters.industry;
      const hasMatchingJob = filters.jobTitle === 'All' ||
        allJobProfiles.some(profile =>
          profile.company?.id === c.id &&
          profile.title === filters.jobTitle
        );
      return matchesIndustry && hasMatchingJob;
    });
  }, [companies, filters, allJobProfiles]);

  const company = filtered[selected] || {};

  const currentJobProfiles = useMemo(() => {
    if (!company.id || !allJobProfiles.length) return [];
    return allJobProfiles.filter(profile => profile.company?.id === company.id);
  }, [company.id, allJobProfiles]);

  const getJobProfilesCount = (companyId) => {
    if (!companyId || !allJobProfiles.length) return 0;
    return allJobProfiles.filter(profile => profile.company?.id === companyId).length;
  };

  const handleModalSubmit = async () => {
    if (!selectedProfileId) return;

    setRegisteringJobs((prev) => new Set([...prev, selectedProfileId]));
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/api/job-fairs/${JOB_FAIR_ID}/interview-requests`,
        {
          job_profile_id: selectedProfileId,
          message: applicationMessage?.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Interview request submitted successfully!');
      setAppliedProfiles((prev) => new Set([...prev, selectedProfileId]));
      setShowModal(false);
      setApplicationMessage('');
      setSelectedProfileId(null);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 409) {
        toast.warning('You have already applied for this position!');
        setAppliedProfiles((prev) => new Set([...prev, selectedProfileId]));
      } else {
        toast.error('Failed to submit application, please make sure you upload your resume.');
      }
    } finally {
      setRegisteringJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedProfileId);
        return newSet;
      });
      if (applicationMessage && applicationMessage.trim().length === 0) {
      toast.error("Please write a valid message or leave it empty.");
      return;
    }
    }
  };

  useEffect(() => {
    if (filtered.length > 0 && selected >= filtered.length) {
      setSelected(0);
    }
  }, [filtered.length, selected]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <Sidebar />
        <div className="flex-1 p-4 flex flex-col lg:flex-row gap-6 with-sidebar mt-24">
          <div className="lg:w-96 w-full space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Filters ({filtered.length})</h3>
              <div className="space-y-2">
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filters.industry}
                  onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
                  ))}
                </select>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filters.jobTitle}
                  onChange={e => setFilters(f => ({ ...f, jobTitle: e.target.value }))}
                >
                  {jobTitles.map(title => (
                    <option key={title} value={title}>{title === 'All' ? 'All Positions' : title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow divide-y max-h-96 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No companies found</div>
              ) : (
                filtered.map((c, i) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-orange-50 ${
                      selected === i ? 'border-l-4 border-red-900 bg-orange-50' : ''
                    }`}
                    onClick={() => setSelected(i)}
                  >
                    <ImageWithFallback
                      src={c.logo_path}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover"
                      fallbackText={c.name}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.industry}</div>
                      <div className="text-xs text-blue-600">{getJobProfilesCount(c.id)} Positions</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {company?.name ? (
              <div>
                <div className="flex gap-4 items-center mb-6">
                  <ImageWithFallback
                    src={company.logo_path}
                    alt={company.name}
                    className="w-20 h-20 rounded-lg object-cover"
                    fallbackText={company.name}
                  />
                  <div>
                    <h1 className="font-bold text-2xl">{company.name}</h1>
                    <div className="text-sm text-gray-600">{company.industry}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-4">
                    Available Positions ({currentJobProfiles.length})
                    {loadingProfiles && <span className="text-sm text-gray-500"> (Loading...)</span>}
                  </h4>
                  {loadingProfiles ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : currentJobProfiles.length > 0 ? (
                    <div className="space-y-4">
                      {currentJobProfiles.map(profile => (
                        <div key={profile.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold">{profile.title}</h5>
                            <span className="px-2 py-1 text-xs rounded bg-red-900 text-red-900">
                              {profile.employment_type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                          <div className="flex justify-between items-center">
                            {!appliedProfiles.has(profile.id) ? (
                              <button
                                onClick={() => {
                                  setSelectedProfileId(profile.id);
                                  setShowModal(true);
                                }}
                                className="px-4 py-2 rounded text-sm font-medium bg-red-900 text-white hover:bg-red-800"
                              >
                                Apply Now
                              </button>
                            ) : (
                              <div className="text-green-700 text-sm font-semibold">
                                ✅ Applied Successfully
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">💼</div>
                      <p>No positions available for this company.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <p>Select a company to view details and positions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />

      {/* Modal for Application Message */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Application Message</h2>
            <textarea
              rows="4"
              className="w-full border rounded p-2 mb-4 text-sm"
              placeholder="Write your message (optional)..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setApplicationMessage('');
                  setSelectedProfileId(null);
                }}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 text-sm rounded bg-red-800 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDirectory;
