import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import {
  Calendar,
  Clock,
  User,
  Mail,
  MapPin,
  Eye,
  Users,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  Star,
  TrendingUp,
  Sparkles,
  Building,
  FileText,
  Phone,
  Download,
  ExternalLink,
  UserCheck,
  StopCircle
} from 'lucide-react';

const InterviewTracking = () => {
  const { companyId } = useParams();
  const jobFairId = localStorage.getItem('jobFairId');
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingInterview, setProcessingInterview] = useState(false);
  let requestData = null;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.get(`/job-fairs/${jobFairId}/queues/company/${companyId}`);
        const approvedOnly = res.data.data.queue.filter(
          (entry) => entry.interview_request_id && entry.status !== 'cancelled'
        );
        setQueueData(approvedOnly);
      } catch (err) {
        console.error('Error fetching interview queue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [jobFairId, companyId]);
  const fetchQueue = async () => {
  try {
    const res = await api.get(`/job-fairs/${jobFairId}/queues/company/${companyId}`);
    const approvedOnly = res.data.data.queue.filter(
      (entry) => entry.interview_request_id && entry.status !== 'cancelled'
    );
    setQueueData(approvedOnly);
  } catch (err) {
    console.error('Error fetching interview queue:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const fetchExtraUserInfo = async () => {
      const studentId = selectedStudent?.student?.id;
      if (!studentId) return;

      try {
        const res = await api.get(`/users/${studentId}`); 
        const user = res.data.data.user;

        setSelectedStudent(prev => ({
          ...prev,
          student: {
            ...prev.student,
            linkedin_url: user.linkedin_url,
            github_url: user.github_url
          }
        }));
      } catch (err) {
        console.error('Error fetching user profile links:', err);
      }
    };

    fetchExtraUserInfo();
  }, [selectedStudent?.student?.id]);

  const getStatusStats = () => {
    return {
      total: queueData.length,
      waiting: queueData.filter(e => e.status === 'waiting').length,
      in_interview: queueData.filter(e => e.status === 'in_interview').length,
      completed: queueData.filter(e => e.status === 'completed').length,
      skipped: queueData.filter(e => e.status === 'skipped' || e.status === 'pending').length
    };
  };

const handleInterviewAction = async (action) => {
  if (!selectedStudent) return;

  setProcessingInterview(true);
  try {
    let endpoint = '';
    let method = 'put'; 
    let data = {};
    let newStatus = selectedStudent.status;

    switch (action) {
      case 'start':
        endpoint = `/job-fairs/${jobFairId}/queues/slot/${selectedStudent.slot.id}/next`;
        method = 'post';
        newStatus = 'in_interview';
        break;

      case 'end':
        endpoint = `/job-fairs/${jobFairId}/queues/${selectedStudent.queue_id}/end-interview`;
        method = 'post';
        newStatus = 'completed';
        break;

      case 'skip':
      case 'pending':
        endpoint = `/job-fairs/${jobFairId}/queues/${selectedStudent.queue_id}/pending`;
        method = 'put';
        data = { status: 'pending' };
        newStatus = 'waiting';
        break;

      case 'resume':
        endpoint = `/job-fairs/${jobFairId}/queues/${selectedStudent.queue_id}/resume`;
        method = 'put';
        data = { status: 'resume' };
        newStatus = 'start interview';
        break;

      default:
        return;
    }

    console.log(`Calling ${method} ${endpoint} with data:`, data);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    let res;
    if (method === 'post') {
      res = await api.post(endpoint, { headers });
    } else if (method === 'put') {
      res = await api.put(endpoint, data, { headers });
    } else if (method === 'delete') {
      res = await api.delete(endpoint, { headers });
    }



    setQueueData((prev) =>
      prev.map((entry) =>
        entry.queue_id === selectedStudent.queue_id
          ? { ...entry, status: newStatus }
          : entry
      )
    );
    setSelectedStudent((prev) => ({ ...prev, status: newStatus }));
  } catch (error) {
    console.error(`❌ Error performing action [${action}]:`, error.response?.data || error.message);
    alert(error.response?.data?.message || 'Something went wrong');
  } finally {
    await fetchQueue();

    setProcessingInterview(false);
  }
};



  const openStudentModal = (entry) => {
    setSelectedStudent(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 'in_interview': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'skipped': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting': return <Clock className="h-4 w-4" />;
      case 'in_interview': return <PlayCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'skipped': return <PauseCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-white/20 via-white/40 to-white/20">
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
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Interview Tracking
                </h1>
                <p className="text-white/80 text-lg font-medium">
                  Monitor and manage your interview queue in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>{getStatusStats().total} Interviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Interviews', value: getStatusStats().total, color: '#203947', icon: TrendingUp, bg: 'from-slate-500 to-slate-600' },
            { label: 'Waiting', value: getStatusStats().waiting, color: '#f59e0b', icon: Clock, bg: 'from-amber-500 to-yellow-500' },
            { label: 'In Interview', value: getStatusStats().in_interview, color: '#3b82f6', icon: PlayCircle, bg: 'from-blue-500 to-indigo-500' },
            { label: 'Completed', value: getStatusStats().completed, color: '#10b981', icon: CheckCircle, bg: 'from-emerald-500 to-teal-500' },
            { label: 'Skipped', value: getStatusStats().skipped, color: '#6b7280', icon: PauseCircle, bg: 'from-gray-400 to-gray-500' }
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
        <div className="from-white/20 via-white/40 to-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-[#203947] via-[#ad565a] to-[#203947] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <h2 className="text-2xl font-bold">
                  Interview Queue
                </h2>
              </div>
              <p className="text-white/90 font-medium">
                Real-time tracking of all scheduled interviews
              </p>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#901b20] rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-gray-600 mt-6 font-semibold text-lg">Loading interview queue...</p>
              </div>
            ) : queueData.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Interviews Scheduled</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
                  No interviews found for this company. Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {queueData.map((entry, index) => (
                  <div
                    key={entry.queue_id}
                    className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/50 backdrop-blur-sm"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="relative">
                          <img
                            src={entry.student?.profile_image}
                            alt={`${entry.student?.first_name}`}
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {entry.queue_position}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#203947] mb-2">
                            {entry.student?.first_name} {entry.student?.last_name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Mail className="h-4 w-4 mr-2 text-[#901b20]" />
                            {entry.student?.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Building className="h-4 w-4 mr-2 text-[#901b20]" />
                            {entry.student?.track_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <UserCheck className="h-4 w-4 mr-2 text-[#901b20]" />
                            <span className="font-medium">Queue Position:</span>
                            <span className="ml-2 px-3 py-1 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white rounded-full text-xs font-bold">
                              #{entry.queue_position}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 md:mt-0 flex flex-col items-end space-y-3">
                        <button
                          onClick={() => openStudentModal(entry)}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-[#203947]/50 to-[#203947]/60 text-white rounded-xl hover:from-[#203947]/70 hover:to-[#203947]/70 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          View Profile
                        </button>
                        <div className="flex items-center">
                          <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 ${getStatusColor(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                            <span>{entry.status.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Student Profile Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="px-8 py-6 bg-gradient-to-r from-[#203947] via-[#ad565a] to-[#203947] text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedStudent.student?.first_name} {selectedStudent.student?.last_name}
                      </h2>
                      <p className="text-white/90 font-medium">
                        Queue Position #{selectedStudent.queue_position}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                  >
                    <XCircle className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                {/* Student Information */}
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                      <UserCheck className="h-5 w-5 mr-2 text-[#901b20]" />
                      Student Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mr-4">
                          {selectedStudent.student?.profile_image ? (
                            <img
                              src={selectedStudent.student.profile_image}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <User className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#203947] text-lg">
                            {selectedStudent.student?.first_name} {selectedStudent.student?.last_name}
                          </h4>
                          <p className="text-gray-600 font-medium">{selectedStudent.student?.track_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3 text-[#901b20]" />
                        <span>{selectedStudent.student?.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-[#901b20]" />
                        <span>{selectedStudent.student?.phone}</span>
                      </div>
                      {selectedStudent.student?.linkedin_url && (
  <div className="flex items-center text-gray-600">
    <ExternalLink className="h-4 w-4 mr-3 text-[#0e76a8]" />
    <a
      href={selectedStudent.student.linkedin_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-700 hover:underline"
    >
      LinkedIn Profile
    </a>
  </div>
)}

{selectedStudent.student?.github_url && (
  <div className="flex items-center text-gray-600 mt-2">
    <ExternalLink className="h-4 w-4 mr-3 text-black" />
    <a
      href={selectedStudent.student.github_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-800 hover:underline"
    >
      GitHub Profile
    </a>
  </div>
)}
                    </div>
                  </div>
                  

                  {/* CV Section */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#901b20]" />
                      CV Document
                    </h3>
                    {selectedStudent.student?.cv_path ? (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#203947]">CV Document</p>
                            <p className="text-sm text-gray-600">PDF Format</p>
                          </div>
                        </div>
{selectedStudent?.student?.cv_path ? (
  <button
    onClick={() => {
      const fullUrl = selectedStudent.student.cv_path.startsWith('http')
        ? selectedStudent.student.cv_path
        : `http://127.0.0.1:8000/storage/${selectedStudent.student.cv_path}`;
      window.open(fullUrl, '_blank');
    }}
    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
  >
    <ExternalLink className="h-4 w-4 mr-2" />
    View PDF
  </button>
) : (
  <p className="text-sm text-gray-500 italic">No CV uploaded</p>
)}

                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No CV uploaded</p>
                    )}
                  </div>
                </div>

                {/* Interview Actions */}
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-[#901b20]" />
                      Interview Actions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200/50">
                        <div>
                          <p className="font-semibold text-[#203947]">Current Status</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center space-x-2 ${getStatusColor(selectedStudent.status)}`}>
                              {getStatusIcon(selectedStudent.status)}
                              <span>{selectedStudent.status.replace('_', ' ').toUpperCase()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic action buttons based on status */}
                      <div className="space-y-3">
                        {selectedStudent.status === 'waiting' && (
                          <>
                            <button
                              onClick={() => handleInterviewAction('start')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <PlayCircle className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Start Interview'}
                            </button>
                            <button
                              onClick={() => handleInterviewAction('skip')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <PauseCircle className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Skip Interview'}
                            </button>
                          </>
                        )}

                        {selectedStudent.status === 'in_interview' && (
                          <>
                            <button
                              onClick={() => handleInterviewAction('end')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <CheckCircle className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'End Interview'}
                            </button>
                            <button
                              onClick={() => handleInterviewAction('pending')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#901b20]/50 to-[#901b20]/80 text-white rounded-xl hover:from-[#901b20]/90 hover:to-[#901b20]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <Clock className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Mark as Pending'}
                            </button>
                          </>
                        )}

                        {/* COMPLETED: Reset to Pending */}
                        {selectedStudent.status === 'completed' && (
                          <div className="text-center py-4">
                            <p className="text-gray-600 font-medium">
                              Interview completed successfully
                            </p>
                            <button
                              onClick={() => handleInterviewAction('pending')}
                              disabled={processingInterview}
                              className="mt-3 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold mx-auto"
                            >
                              <Clock className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Reset to Pending'}
                            </button>
                          </div>
                        )}

                        {/* SKIPPED: Resume or Reset to Pending */}
                        {selectedStudent.status === 'skipped' && (
                          <div className="text-center py-4 space-y-3">
                            <p className="text-gray-600 font-medium">
                              Interview was skipped
                            </p>
                            <button
                              onClick={() => handleInterviewAction('resume')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <PlayCircle className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Resume Interview'}
                            </button>
                            <button
                              onClick={() => handleInterviewAction('pending')}
                              disabled={processingInterview}
                              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                            >
                              <Clock className="h-5 w-5 mr-2" />
                              {processingInterview ? 'Processing...' : 'Reset to Pending'}
                            </button>
                          </div>
                        )}

                        {/* PENDING: Resume (if you have such a status) */}
                        {selectedStudent.status === 'pending' && (
                          <button
                            onClick={() => handleInterviewAction('resume')}
                            disabled={processingInterview}
                            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                          >
                            <PlayCircle className="h-5 w-5 mr-2" />
                            {processingInterview ? 'Processing...' : 'Resume Interview'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                    <h3 className="text-lg font-bold text-[#203947] mb-4">Notes</h3>
                    <textarea
                      className="w-full h-32 p-4 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-transparent resize-none bg-white/70 backdrop-blur-sm"
                      placeholder="Add notes about this interview..."
                      value={selectedStudent.notes || ''}
                      onChange={(e) => setSelectedStudent(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default InterviewTracking;