import { useState, useEffect } from 'react';
import {
  Eye, Check, X, Users, Briefcase, MapPin, Clock, ChevronDown, TrendingUp, Search, Filter, Calendar, MessageCircle, Mail
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const InterviewRequestsManager = () => {
  const [jobProfiles, setJobProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [interviewRequests, setInterviewRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [participationId, setParticipationId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const BASE_URL = 'http://127.0.0.1:8000/api';
  const { jobFairId, companyId } = useParams();

  useEffect(() => {
    fetchParticipationAndJobProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile && participationId) {
      fetchInterviewRequests(participationId, selectedProfile.id);
    }
  }, [selectedProfile, participationId]);

  const fetchParticipationAndJobProfiles = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/job-fairs/${jobFairId}/participations`);
      if (!res.ok) throw new Error('Failed to fetch participations');

      const participationsData = await res.json();
const participation = participationsData.data?.result?.find(
  p => p.company_id == companyId
);

      console.log('companyId from useParams:', companyId);
console.log('participations fetched:', participationsData.data?.result);

      if (!participation) throw new Error('Participation not found for this company');

      setParticipationId(participation.id);

      const jobProfilesRes = await fetch(`${BASE_URL}/job-fairs/${jobFairId}/participations/${participation.id}/job-profiles`);
      if (!jobProfilesRes.ok) throw new Error('Failed to fetch job profiles');

      const jobProfilesData = await jobProfilesRes.json();
      const profiles = jobProfilesData.data?.job_profiles || [];
      
      setJobProfiles(profiles);
      if (profiles.length > 0) {
        setSelectedProfile(profiles[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewRequests = async (participationId, jobProfileId) => {
    try {
      setLoadingRequests(true);
      const url = `${BASE_URL}/job-fairs/${jobFairId}/job-profiles/${jobProfileId}/interview-requests`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch interview requests');

      const data = await response.json();
      setInterviewRequests(data.data?.result || []);
      console.log('Fetched interview requests:', interviewRequests);

    } catch (err) {
      console.error('Error fetching interview requests:', err);
      setError(err.message);
    } finally {
      setLoadingRequests(false);
      
    }
  };

  const reviewInterviewRequest = async (requestId, status) => {
    try {
      setProcessingRequest(requestId);
      const response = await fetch(`${BASE_URL}/job-fairs/interview-requests/${requestId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update request status');

      if (selectedProfile && participationId) {
        fetchInterviewRequests(participationId, selectedProfile.id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingRequest(null);
    }
  };
    const filteredRequests = interviewRequests.filter(request => {
    const matchesSearch = `${request.user?.first_name} ${request.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: interviewRequests.length,
      pending: interviewRequests.filter(r => r.status === 'pending').length,
      approved: interviewRequests.filter(r => r.status === 'approved').length,
      rejected: interviewRequests.filter(r => r.status === 'rejected').length
    };
    return stats;
  };

    const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
    const getTrackColor = (trackColor) => {
    return trackColor || '#203947';
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-[#203947]">Loading job profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-red-500 text-center">
            <X className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#901b20] text-white rounded hover:bg-[#801418] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#203947] mb-2">Interview Requests</h1>
                <p className="text-gray-600">Manage and review interview requests for your job profiles</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-[#901b20] text-white px-4 py-2 rounded-full text-sm font-medium">
                  {jobProfiles.length} Active Profiles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Job Profiles Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white">
                <h2 className="text-lg font-bold flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Job Profiles
                </h2>
                <p className="text-sm opacity-90 mt-1">{jobProfiles.length} active positions</p>
              </div>
              <div className="divide-y divide-gray-100">
                {jobProfiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`w-full p-5 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedProfile?.id === profile.id 
                        ? 'bg-gradient-to-r from-[#ebebeb] to-[#cc9598]/20 border-r-4 border-[#901b20] shadow-inner' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#203947] mb-2 text-sm">{profile.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3 mr-1 text-[#901b20]" />
                          {profile.location}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Users className="h-3 w-3 mr-1 text-[#901b20]" />
                          {profile.positions_available} positions
                        </div>
                        {profile.track_preferences && profile.track_preferences.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {profile.track_preferences.map((pref) => (
                              <span
                                key={pref.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: getTrackColor(pref.track.color) }}
                              >
                                {pref.track.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                        selectedProfile?.id === profile.id ? 'rotate-180 text-[#901b20]' : ''
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Interview Requests Content */}
          <div className="xl:col-span-3">
            {selectedProfile ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Requests', value: getStatusStats().total, color: '#203947', icon: TrendingUp },
                    { label: 'Pending', value: getStatusStats().pending, color: '#cc9598', icon: Clock },
                    { label: 'Approved', value: getStatusStats().approved, color: '#28a745', icon: Check },
                    { label: 'Rejected', value: getStatusStats().rejected, color: '#dc3545', icon: X }
                  ].map((stat, index) => (
                    <div 
                      key={stat.label}
                      className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}15` }}>
                          <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 bg-gradient-to-r from-[#203947] to-[#ad565a] text-white">
                    <h2 className="text-xl font-bold mb-1">
                      Interview Requests for "{selectedProfile.title}"
                    </h2>
                    <p className="text-sm opacity-90">
                      {selectedProfile.participation?.company?.name} • {selectedProfile.location}
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all duration-200"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {loadingRequests ? (
                      <div className="text-center py-12">
                        <div className="relative inline-block">
                          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
                          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#901b20] rounded-full animate-spin border-t-transparent"></div>
                        </div>
                        <p className="text-gray-500 mt-4 font-medium">Loading interview requests...</p>
                      </div>
                    ) : filteredRequests.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Requests</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'No requests match your current filters.' 
                            : 'No interview requests have been submitted for this job profile yet.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredRequests.map((request, index) => (
                          <div 
                            key={request.id} 
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] bg-white"
                            style={{
                              animationDelay: `${index * 100}ms`,
                              animation: 'fadeInUp 0.5s ease-out forwards'
                            }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <div className="w-10 h-10 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full flex items-center justify-center mr-3">
                                    <div className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-[#203947] text-lg">
                                      {`${request.user?.first_name || ''} ${request.user?.last_name || ''}`.trim() || 'Student Name'}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {request.user?.email || 'student@email.com'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                  <Calendar className="h-4 w-4 mr-2 text-[#901b20]" />
                                  Submitted: {new Date(request.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                                  {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                                </span>
                              </div>
                            </div>

                            {request.message && (
                              <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-[#901b20]">
                                <div className="flex items-start">
                                  <MessageCircle className="h-4 w-4 text-[#901b20] mt-0.5 mr-2 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
                                </div>
                              </div>
                            )}

                            {request.status === 'pending' && (
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => reviewInterviewRequest(request.id, 'approved')}
                                  disabled={processingRequest === request.id}
                                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md text-sm font-medium"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  {processingRequest === request.id ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => reviewInterviewRequest(request.id, 'rejected')}
                                  disabled={processingRequest === request.id}
                                  className="flex items-center px-4 py-2 bg-[#901b20] text-white rounded-lg hover:bg-[#801418] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md text-sm font-medium"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  {processingRequest === request.id ? 'Processing...' : 'Reject'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#203947] mb-3">Select a Job Profile</h3>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                  Choose a job profile from the sidebar to view and manage interview requests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

<style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>
    </div>
  );
};

export default InterviewRequestsManager;