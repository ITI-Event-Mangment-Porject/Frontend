import React, { useState } from 'react';
import { Users, CheckCircle, Calendar, MoreVertical, Filter, Search, Building2, TrendingUp, Clock, MapPin, Phone, Video, User } from 'lucide-react';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const jobFairStats = [
    {
      name: "Spring Tech Fair 2024",
      location: "Cairo Convention Center",
      date: "March 15-17, 2024",
      applications: 45,
      interviews: 32,
      hired: 8,
      status: "Completed"
    },
    {
      name: "Creative Minds Expo",
      location: "Alexandria Business Hub",
      date: "April 20-22, 2024",
      applications: 38,
      interviews: 25,
      hired: 6,
      status: "Completed"
    },
    {
      name: "Innovate Summit 2024",
      location: "New Capital Expo Center",
      date: "July 10-12, 2024",
      applications: 52,
      interviews: 28,
      hired: 4,
      status: "In Progress"
    }
  ];

  const todaySchedule = [
    {
      id: 1,
      time: "09:00 AM",
      candidate: "Ahmed Hassan",
      role: "Frontend Developer",
      type: "video",
      duration: "45 min",
      status: "confirmed"
    },
    {
      id: 2,
      time: "10:30 AM",
      candidate: "Fatma Ali",
      role: "UI/UX Designer",
      type: "phone",
      duration: "30 min",
      status: "confirmed"
    },
    {
      id: 3,
      time: "02:00 PM",
      candidate: "Mohamed Samir",
      role: "Backend Developer",
      type: "video",
      duration: "60 min",
      status: "pending"
    },
    {
      id: 4,
      time: "03:30 PM",
      candidate: "Nour Mahmoud",
      role: "Product Manager",
      type: "in-person",
      duration: "45 min",
      status: "confirmed"
    },
    {
      id: 5,
      time: "05:00 PM",
      candidate: "Kareem Essam",
      role: "Data Analyst",
      type: "video",
      duration: "30 min",
      status: "pending"
    }
  ];

  const recentRequests = [
    {
      id: 1,
      candidate: "Alice Johnson",
      role: "Software Engineer",
      jobFair: "Spring Tech Fair 2024",
      status: "Pending",
      requestedOn: "2024-07-28"
    },
    {
      id: 2,
      candidate: "Bob Williams",
      role: "UX Designer",
      jobFair: "Creative Minds Expo",
      status: "Action Required",
      requestedOn: "2024-07-27"
    },
    {
      id: 3,
      candidate: "Charlie Brown",
      role: "Data Analyst",
      jobFair: "Spring Tech Fair 2024",
      status: "Scheduled",
      requestedOn: "2024-07-26"
    },
    {
      id: 4,
      candidate: "Sarah Davis",
      role: "DevOps Engineer",
      jobFair: "Tech Innovation Summit",
      status: "Pending",
      requestedOn: "2024-07-25"
    }
  ];

  const completedInterviews = [
    {
      id: 1,
      candidate: "Omar Khaled",
      role: "Full Stack Developer",
      jobFair: "Spring Tech Fair 2024",
      interviewDate: "2024-07-20",
      result: "Hired",
      rating: 9
    },
    {
      id: 2,
      candidate: "Yasmin Ahmed",
      role: "Marketing Specialist",
      jobFair: "Creative Minds Expo",
      interviewDate: "2024-07-19",
      result: "Rejected",
      rating: 6
    },
    {
      id: 3,
      candidate: "Tamer Farouk",
      role: "DevOps Engineer",
      jobFair: "Innovate Summit 2024",
      interviewDate: "2024-07-18",
      result: "Second Round",
      rating: 8
    },
    {
      id: 4,
      candidate: "Dina Mostafa",
      role: "Product Designer",
      jobFair: "Creative Minds Expo",
      interviewDate: "2024-07-17",
      result: "Hired",
      rating: 9
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Action Required':
        return 'bg-red-100 text-red-800';
      case 'Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Second Round':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScheduleIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Job Fair Participation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-red-600" />
          Job Fair Participation Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {jobFairStats.map((fair, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">{fair.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  fair.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {fair.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {fair.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {fair.date}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-red-600">{fair.applications}</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">{fair.interviews}</div>
                  <div className="text-xs text-gray-500">Interviews</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{fair.hired}</div>
                  <div className="text-xs text-gray-500">Hired</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-600" />
          Today's Interview Schedule
        </h2>
        <div className="space-y-4">
          {todaySchedule.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900 w-20">
                  {interview.time}
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {interview.candidate.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{interview.candidate}</div>
                  <div className="text-sm text-gray-500">{interview.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {getScheduleIcon(interview.type)}
                  <span className="capitalize">{interview.type}</span>
                </div>
                <div className="text-sm text-gray-500">{interview.duration}</div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  interview.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {interview.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInterviewRequests = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Interview Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Fair</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentRequests.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {item.candidate.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.candidate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jobFair}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.requestedOn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <button className="hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompletedInterviews = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Completed Interviews</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Fair</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {completedInterviews.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {item.candidate.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.candidate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jobFair}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.interviewDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.result)}`}>
                    {item.result}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{item.rating}/10</span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${item.rating * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <button className="hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Overview of Job Fair participation, Interview requests, completed interviews, and daily schedule</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Requests</p>
                <p className="text-3xl font-bold">124</p>
              </div>
              <Users className="h-8 w-8 text-red-200" />
            </div>
          </div>
          
          <div className="bg-slate-700 text-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Completed Interviews</p>
                <p className="text-3xl font-bold">78</p>
              </div>
              <CheckCircle className="h-8 w-8 text-slate-300" />
            </div>
          </div>
          
          <div className="bg-red-700 text-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm font-medium">Upcoming Interviews</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Calendar className="h-8 w-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Interview Requests
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed Interviews
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'requests' && renderInterviewRequests()}
        {activeTab === 'completed' && renderCompletedInterviews()}
      </div>
    </div>
  );
};

export default CompanyDashboard;