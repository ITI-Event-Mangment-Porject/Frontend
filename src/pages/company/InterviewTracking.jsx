import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Calendar, 
  Star, 
  Users, 
  CheckCircle, 
  Clock,
  Eye,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  X
} from 'lucide-react';

export default function InterviewTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  // Sample data for interviews
  const [interviews] = useState([
    {
      id: 1,
      candidate: { name: 'Alice Johnson', avatar: 'AJ' },
      jobTitle: 'Software Engineer',
      interviewer: 'Jane Smith',
      date: '2024-06-15',
      status: 'Completed',
      rating: 5,
      notes: 'Strong technical skills, great communication, cultural fit. Recommended for next round.'
    },
    {
      id: 2,
      candidate: { name: 'Bob Williams', avatar: 'BW' },
      jobTitle: 'Product Manager',
      interviewer: 'David Lee',
      date: '2024-07-14',
      status: 'Pending Follow-up',
      rating: 4,
      notes: 'Good strategic thinking, needs more clarity on execution skills. Promising second interview.'
    },
    {
      id: 3,
      candidate: { name: 'Charlie Brown', avatar: 'CB' },
      jobTitle: 'UX Designer',
      interviewer: 'Emily Davis',
      date: '2024-06-15',
      status: 'Completed',
      rating: 3,
      notes: 'Creative thinking, but lacked clear articulation of design decisions.'
    },
    {
      id: 4,
      candidate: { name: 'Diana Prince', avatar: 'DP' },
      jobTitle: 'Marketing Manager',
      interviewer: 'Frank Wilson',
      date: '2024-06-12',
      status: 'Completed',
      rating: 5,
      notes: 'Excellent communication, highly creative. Great fit!'
    },
    {
      id: 5,
      candidate: { name: 'Ethan Hunt', avatar: 'EH' },
      jobTitle: 'Data Analyst',
      interviewer: 'Grace Hall',
      date: '2024-06-11',
      status: 'Scheduled',
      rating: 4,
      notes: 'Strong analytical skills, some R experience needed. Shows potential.'
    },
    {
      id: 6,
      candidate: { name: 'Fiona Clark', avatar: 'FC' },
      jobTitle: 'HR Consultant',
      interviewer: 'Harry King',
      date: '2024-07-10',
      status: 'Completed',
      rating: 3,
      notes: 'Good understanding of HR processes, cultural fit concerns.'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Follow-up':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? 'fill-[#901b20] text-[#901b20]' : 'text-[#ebebeb]'
        }`}
      />
    ));
  };

  const completedInterviews = interviews.filter(i => i.status === 'Completed').length;
  const averageRating = interviews.reduce((sum, i) => sum + i.rating, 0) / interviews.length;
  const pendingFollowUps = interviews.filter(i => i.status === 'Pending Follow-up').length;

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || interview.status === selectedStatus;
    const matchesRating = selectedRating === 'all' || interview.rating >= parseInt(selectedRating);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        {/* <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#203947]">Interview Tracking</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and track your interview process</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#203947] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm">
                  <FileText className="w-4 h-4" />
                  Export Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#901b20] rounded-lg hover:bg-[#7d1419] hover:shadow-md transition-all duration-200 shadow-sm">
                  <Plus className="w-4 h-4" />
                  Add Interview
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Interviews Completed</p>
                  <p className="text-3xl font-bold text-[#203947] mb-1">{completedInterviews}</p>
                  <p className="text-xs text-gray-500">Total interviews this month</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Average Rating</p>
                  <p className="text-3xl font-bold text-[#203947] mb-1">{averageRating.toFixed(1)} / 5</p>
                  <p className="text-xs text-gray-500">Across all completed interviews</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Pending Follow-ups</p>
                  <p className="text-3xl font-bold text-[#203947] mb-1">{pendingFollowUps}</p>
                  <p className="text-xs text-gray-500">Candidates awaiting next steps</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Interview Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#203947]">Interview Log</h2>
                  <p className="text-sm text-gray-600 mt-1">{filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} found</p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                    showFilters 
                      ? 'bg-[#901b20] text-white border-[#901b20] shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidates, job titles, or interviewers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-all duration-200 text-sm"
                  />
                </div>

                {showFilters && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                        >
                          <option value="all">All Statuses</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending Follow-up">Pending Follow-up</option>
                          <option value="Scheduled">Scheduled</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                        <select
                          value={selectedRating}
                          onChange={(e) => setSelectedRating(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] text-sm"
                        >
                          <option value="all">All Ratings</option>
                          <option value="5">5 Stars</option>
                          <option value="4">4+ Stars</option>
                          <option value="3">3+ Stars</option>
                          <option value="2">2+ Stars</option>
                          <option value="1">1+ Stars</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setSelectedStatus('all');
                            setSelectedRating('all');
                            setSearchTerm('');
                          }}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Job Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Interviewer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ad565a] to-[#cc9598] text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                            {interview.candidate.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#203947]">
                              {interview.candidate.name}
                            </div>
                            <div className="text-xs text-gray-500">Candidate</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{interview.jobTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{interview.interviewer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(interview.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {renderStars(interview.rating)}
                          <span className="text-sm text-gray-600 ml-2">({interview.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={interview.notes}>
                          {interview.notes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-[#901b20] hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:bg-red-50">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInterviews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}