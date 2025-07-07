import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';
const JOB_FAIR_ID = 1;

const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState({ industry: 'All', size: 'All', is_approved: 'All', jobTitle: 'All' });
  const [allJobProfiles, setAllJobProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [registeringJobs, setRegisteringJobs] = useState(new Set());
  const [appliedProfiles, setAppliedProfiles] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/api/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCompanies(res.data?.data?.companies?.data || []))
      .catch(err => console.error('Error fetching companies:', err));
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
        setAllJobProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchJobProfiles();
  }, []);

  const industries = useMemo(() => ['Industry', ...Array.from(new Set(companies.map(c => c.industry).filter(Boolean)))], [companies]);
  const jobTitles = useMemo(() => ['Position', ...Array.from(new Set(allJobProfiles.map(p => p.title).filter(Boolean)))], [allJobProfiles]);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchesIndustry = filters.industry === 'All' || c.industry === filters.industry;
      const hasMatchingJob = filters.jobTitle === 'All' ||
        allJobProfiles.some(profile =>
          profile.participation?.company_id === c.id &&
          profile.title === filters.jobTitle
        );
      return matchesIndustry && hasMatchingJob;
    });
  }, [companies, filters, allJobProfiles]);

  const company = filtered[selected] || {};
  const currentJobProfiles = useMemo(() => {
    if (!company.id || !allJobProfiles.length) return [];
    return allJobProfiles.filter(profile => profile.participation?.company_id === company.id);
  }, [company.id, allJobProfiles]);

  const getJobProfilesCount = (companyId) => {
    if (!companyId || !allJobProfiles.length) return 0;
    return allJobProfiles.filter(profile => profile.participation?.company_id === companyId).length;
  };

  const handleRegister = async (profileId) => {
    setRegisteringJobs(prev => new Set([...prev, profileId]));
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/api/job-fairs/${JOB_FAIR_ID}/interview-requests`, {
        job_profile_id: profileId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Interview request submitted successfully!');
      setAppliedProfiles(prev => new Set([...prev, profileId]));
    } catch (error) {
      console.error('Error sending interview request:', error);
      toast.error('An error occurred while submitting your interview request. Please try again.');
    } finally {
      setRegisteringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    }
  };

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
                <select className="w-full border rounded px-2 py-1 text-sm" value={filters.industry} onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <select className="w-full border rounded px-2 py-1 text-sm" value={filters.jobTitle} onChange={e => setFilters(f => ({ ...f, jobTitle: e.target.value }))}>
                  {jobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </select>
              </div>
              <button className="w-full mt-3 text-sm border-2 border-dashed border-gray-300 rounded-lg py-2 hover:bg-gray-50"
                onClick={() => setFilters({ industry: 'All', size: 'All', is_approved: 'All', jobTitle: 'All' })}>
                🗑️ Clear All Filters
              </button>
            </div>
            <div className="bg-white rounded-lg shadow divide-y">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No companies found.</div>
              ) : (
                filtered.map((c, i) => (
                  <div key={c.id} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-orange-50 ${selected === i ? 'border-l-4 border-orange-500 bg-orange-50' : ''}`} onClick={() => setSelected(i)}>
                    <img src={c.logo_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}`} alt={c.name} className="w-10 h-10 rounded-full object-cover bg-orange-100" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.industry} · {c.location}</div>
                      <div className="text-xs text-blue-600 mt-1">{getJobProfilesCount(c.id)} Positions</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {company?.name ? (
              <div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                  <img src={company.logo_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}`} alt={company.name} className="w-20 h-20 rounded-lg object-cover bg-orange-100" />
                  <div>
                    <h1 className="font-bold text-2xl">{company.name}</h1>
                    <div className="text-sm text-gray-500">{company.industry} · {company.location}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                      {company.website && (
                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer"
                          className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition">
                          🌐 Website
                        </a>
                      )}
                      {company.linkedin_url && (
                        <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="inline-block px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300 transition">
                          💼 LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    Positions ({currentJobProfiles.length})
                    {loadingProfiles && <span className="text-sm text-gray-500">(Loading...)</span>}
                  </h4>
                  {loadingProfiles ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading Positions...</p>
                    </div>
                  ) : currentJobProfiles.length > 0 ? (
                    <div className="space-y-4">
                      {currentJobProfiles.map(profile => (
                        <div key={profile.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-lg">{profile.title}</h5>
                            <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700">{profile.employment_type}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{profile.description}</p>
                          {profile.requirements && <p className="text-sm text-gray-600 mb-3"><strong>Requirements:</strong> {profile.requirements}</p>}
                          {profile.responsibilities && <p className="text-sm text-gray-600 mb-3"><strong>Responsibilities:</strong> {profile.responsibilities}</p>}
                          {profile.benefits && <p className="text-sm text-gray-600 mb-3"><strong>Benefits:</strong> {profile.benefits}</p>}
                          {(profile.salary_min || profile.salary_max) && (
                            <p className="text-sm text-gray-600 mb-3">
                              <strong>Salary:</strong> {profile.salary_min && profile.salary_max
                                ? `${profile.salary_min} - ${profile.salary_max}`
                                : profile.salary_min
                                  ? `From ${profile.salary_min}`
                                  : `Up to ${profile.salary_max}`} {profile.salary_currency || 'EGP'}
                            </p>
                          )}
                          <div className="flex gap-2 mb-3 text-xs">
                            {profile.location && <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">📍 {profile.location}</span>}
                          </div>
                          {profile.track_preferences?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {profile.track_preferences.map(tp => (
                                <span key={tp.id} className={`px-2 py-1 text-xs rounded ${tp.preference_level === 'required' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {tp.track.name} ({tp.preference_level})
                                </span>
                              ))}
                            </div>
                          )}
                          {!appliedProfiles.has(profile.id) ? (
                            <button
                              onClick={() => handleRegister(profile.id)}
                              disabled={registeringJobs.has(profile.id)}
                              className={`px-4 py-2 rounded text-sm font-medium ${registeringJobs.has(profile.id)
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-red-900 text-white hover:bg-red-800'}`}>
                              {registeringJobs.has(profile.id) ? 'Applying...' : 'Apply Now'}
                            </button>
                          ) : (
                            <div className="text-green-700 text-sm font-semibold">✅ Applied</div>
                          )}
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
                <p className="text-lg">Select a company to view details and positions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyDirectory;
