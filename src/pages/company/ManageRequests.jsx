import { useState, useEffect } from 'react';
import {
  Eye, Check, X, Users, Briefcase, MapPin, Clock, ChevronDown, TrendingUp, Search, Filter, Calendar, MessageCircle, Mail
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Briefcase as BriefcaseIcon, Star, CheckCircle, XCircle } from 'lucide-react';
import { Building, ArrowUpRight } from 'lucide-react';
import { Sparkles } from 'lucide-react';

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserRequest, setSelectedUserRequest] = useState(null);



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

          if (response.status === 404) {
      console.warn('No interview requests found for this job profile.');
      setInterviewRequests([]);  
      return;
    }

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
  const openProfileModal = (request) => {
  setSelectedUserRequest(request);
  setShowProfileModal(true);
};
const closeProfileModal = () => {
  setSelectedUserRequest(null);
  setShowProfileModal(false);
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
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Ultra Modern Header */}
      <div className="relative h-48 bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 right-20 w-20 h-20 bg-white/5 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#901b20]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Interview Requests
                </h1>
                <p className="text-white/80 text-lg font-medium">
                  Manage and review interview requests for your job profiles
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>{jobProfiles.length} Active Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-10xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Job Profiles Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-6 bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
                <div className="absolute top-2 right-4 w-8 h-8 bg-white/5 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-2 left-4 w-12 h-12 bg-[#901b20]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold flex items-center">
                    <Building className="h-6 w-6 mr-3" />
                    Job Profiles
                  </h2>
                  <p className="text-white/90 mt-2 font-medium">{jobProfiles.length} active positions</p>
                </div>
              </div>
              <div className="divide-y divide-gray-100/50">
                {jobProfiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`w-full p-6 text-left transition-all duration-500 transform hover:scale-[1.02] group ${
                      selectedProfile?.id === profile.id 
                        ? 'bg-gradient-to-r from-[#901b20]/5 via-[#cc9598]/5 to-transparent border-r-4 border-[#901b20] shadow-lg' 
                        : 'hover:bg-white/50'
                    }`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#203947] mb-3 text-base group-hover:text-[#901b20] transition-colors">
                          {profile.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-[#901b20]" />
                          {profile.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Users className="h-4 w-4 mr-2 text-[#901b20]" />
                          {profile.positions_available} positions
                        </div>
                        {profile.track_preferences && profile.track_preferences.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {profile.track_preferences.map((pref) => (
                              <span
                                key={pref.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                                style={{ backgroundColor: getTrackColor(pref.track.color) }}
                              >
                                {pref.track.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowUpRight className={`h-5 w-5 text-gray-400 transition-all duration-300 ${
                          selectedProfile?.id === profile.id ? 'text-[#901b20] scale-110' : 'group-hover:text-[#901b20]'
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Interview Requests Content */}
          <div className="xl:col-span-3">
            {selectedProfile ? (
              <div className="space-y-8">
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Requests', value: getStatusStats().total, color: '#203947', icon: TrendingUp, bg: 'from-slate-500 to-slate-600' },
                    { label: 'Pending', value: getStatusStats().pending, color: '#cc9598', icon: Clock, bg: 'from-amber-500 to-orange-500' },
                    { label: 'Approved', value: getStatusStats().approved, color: '#10B981', icon: Check, bg: 'from-emerald-500 to-teal-500' },
                    { label: 'Rejected', value: getStatusStats().rejected, color: '#901b20', icon: X, bg: 'from-red-500 to-rose-500' }
                  ].map((stat, index) => (
                    <div 
                      key={stat.label}
                      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-[#203947] group-hover:scale-110 transition-transform">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bg} shadow-lg`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Main Content Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="px-8 py-6 bg-gradient-to-r from-[#203947] via-[#ad565a] to-[#203947] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-2">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                        <h2 className="text-2xl font-bold">
                          Interview Requests for "{selectedProfile.title}"
                        </h2>
                      </div>
                      <p className="text-white/90 font-medium">
                        {selectedProfile.participation?.company?.name} • {selectedProfile.location}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Filters */}
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-50/50 to-slate-50/50 backdrop-blur-sm border-b border-gray-200/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 py-3 w-64 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="border border-gray-200/50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#901b20] focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {loadingRequests ? (
                      <div className="text-center py-16">
                        <div className="relative inline-block">
                          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
                          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#901b20] rounded-full animate-spin border-t-transparent"></div>
                        </div>
                        <p className="text-gray-600 mt-6 font-semibold text-lg">Loading interview requests...</p>
                      </div>
                    ) : filteredRequests.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Eye className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Interview Requests</h3>
                        <p className="text-gray-600 max-w-md mx-auto text-lg">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'No requests match your current filters.' 
                            : 'No interview requests have been submitted for this job profile yet.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {filteredRequests.map((request, index) => (
                          <div 
                            key={request.id} 
                            className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/50 backdrop-blur-sm"
                            style={{
                              animationDelay: `${index * 150}ms`,
                              animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex-1">
                                <div className="flex items-center mb-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                      <div className="w-3 h-3 bg-[#901b20] rounded-full"></div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#203947] text-xl mb-1">
                                      {`${request.user?.first_name || ''} ${request.user?.last_name || ''}`.trim() || 'Student Name'}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Mail className="h-4 w-4 mr-2 text-[#901b20]" />
                                      {request.user?.email || 'student@email.com'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                  <Calendar className="h-4 w-4 mr-2 text-[#901b20]" />
                                  <span className="font-medium">Submitted:</span>
                                  <span className="ml-2">{new Date(request.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(request.status)}`}>
                                  {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                                </span>
                              </div>
                            </div>

                            {request.message && (
                              <div className="mb-6 p-6 bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-2xl border-l-4 border-[#901b20] backdrop-blur-sm">
                                <div className="flex items-start">
                                  <MessageCircle className="h-5 w-5 text-[#901b20] mt-1 mr-3 flex-shrink-0" />
                                  <p className="text-gray-700 leading-relaxed font-medium">{request.message}</p>
                                </div>
                              </div>
                            )}

                            {request.status === 'pending' && (
                              <div className="flex space-x-4">
                                <button
  onClick={() => openProfileModal(request)}
  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
>
  View Profile
</button>

                                <button
                                  onClick={() => reviewInterviewRequest(request.id, 'approved')}
                                  disabled={processingRequest === request.id}
                                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                                >
                                  <Check className="h-5 w-5 mr-2" />
                                  {processingRequest === request.id ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => reviewInterviewRequest(request.id, 'rejected')}
                                  disabled={processingRequest === request.id}
                                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-xl hover:from-[#801418] hover:to-[#9c4a4e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                                >
                                  <X className="h-5 w-5 mr-2" />
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
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-20 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Briefcase className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#203947] mb-4">Select a Job Profile</h3>
                <p className="text-gray-600 text-xl max-w-lg mx-auto leading-relaxed">
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        
        .backdrop-blur-md {
          backdrop-filter: blur(8px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
      {showProfileModal && selectedUserRequest && (
<div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
  <div className="bg-white w-full max-w-4xl rounded-3xl p-0 relative shadow-2xl overflow-hidden max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
    <div className="px-6 py-6 bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
      <div className="absolute top-2 right-4 w-8 h-8 bg-white/5 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute bottom-2 left-4 w-12 h-12 bg-[#901b20]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      
      {/* Content inside header */}
      <div className="relative z-10">
        <button 
          onClick={closeProfileModal} 
          className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">
          {selectedUserRequest.user.first_name} {selectedUserRequest.user.last_name}
        </h2>
        <div className="flex items-center space-x-2 text-white/90">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Student Profile</span>
        </div>
      </div>
    </div>

      {/* Content area with enhanced spacing */}
      <div className="p-8 overflow-auto max-h-[calc(90vh-200px)]">
        {/* Profile information grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Portal ID</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.portal_user_id}</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Email</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Phone</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Track ID</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.track_id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Intake Year</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.intake_year}</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">Graduation Year</span>
                  <p className="text-[#203947] font-medium">{selectedUserRequest.user.graduation_year}</p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">LinkedIn</span>
                  <p className="text-[#203947] font-medium">
                    {selectedUserRequest.user.linkedin_url ? (
                      <a href={selectedUserRequest.user.linkedin_url} target="_blank" className="text-[#901b20] hover:text-[#ad565a] underline transition-colors duration-300">Profile</a>
                    ) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
                <div>
                  <span className="text-[#203947] font-semibold text-sm">GitHub</span>
                  <p className="text-[#203947] font-medium">
                    {selectedUserRequest.user.github_url ? (
                      <a href={selectedUserRequest.user.github_url} target="_blank" className="text-[#901b20] hover:text-[#ad565a] underline transition-colors duration-300">Repo</a>
                    ) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
              <div>
                <span className="text-[#203947] font-semibold text-sm">Portfolio</span>
                <p className="text-[#203947] font-medium">
                  {selectedUserRequest.user.portfolio_url ? (
                    <a href={selectedUserRequest.user.portfolio_url} target="_blank" className="text-[#901b20] hover:text-[#ad565a] underline transition-colors duration-300">Website</a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="group hover:bg-[#ebebeb]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full"></div>
              <div>
                <span className="text-[#203947] font-semibold text-sm">CV</span>
                <p className="text-[#203947] font-medium">
                  {selectedUserRequest.user.cv_path ? (
                    <a href={selectedUserRequest.user.cv_path} target="_blank" className="text-[#901b20] hover:text-[#ad565a] underline transition-colors duration-300">Download CV</a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application message */}
        <div className="mb-8">
          <h3 className="text-[#203947] font-bold text-lg mb-4 flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-[#901b20] to-[#ad565a] rounded-full mr-3"></div>
            Application Message
          </h3>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ebebeb]/80 to-[#cc9598]/20 p-6 border-l-4 border-[#901b20] shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            <p className="text-[#203947] leading-relaxed relative z-10">
              {selectedUserRequest.message || 'No message provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons with enhanced styling */}
      <div className="bg-gradient-to-r from-[#ebebeb]/50 to-[#cc9598]/20 p-6 border-t border-[#ebebeb]">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              reviewInterviewRequest(selectedUserRequest.id, 'approved');
              closeProfileModal();
            }}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-semibold hover:shadow-xl hover:scale-105 transform group"
          >
            <Check className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" /> 
            Approve
          </button>
          <button
            onClick={() => {
              reviewInterviewRequest(selectedUserRequest.id, 'rejected');
              closeProfileModal();
            }}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-2xl hover:from-[#801418] hover:to-[#9c4a4e] transition-all duration-300 shadow-lg font-semibold hover:shadow-xl hover:scale-105 transform group"
          >
            <X className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" /> 
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default InterviewRequestsManager;