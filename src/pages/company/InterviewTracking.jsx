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
  MoreHorizontal
} from 'lucide-react';

export default function InterviewTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
      status: 'Completed',
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
        return 'bg-green-100 text-green-800';
      case 'Pending Follow-up':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-red-500 text-red-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const completedInterviews = interviews.filter(i => i.status === 'Completed').length;
  const averageRating = interviews.reduce((sum, i) => sum + i.rating, 0) / interviews.length;
  const pendingFollowUps = interviews.filter(i => i.status === 'Pending Follow-up').length;

  const filteredInterviews = interviews.filter(interview =>
    interview.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div >
        {/* Page Content */}
        <div className="p-8">
          {/* Page Title and Actions */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Interview Tracking</h1>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add New Interview
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Interviews Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedInterviews}</p>
                  <p className="text-xs text-gray-500">Total interviews this month</p>
                </div>
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)} / 5</p>
                  <p className="text-xs text-gray-500">Across all completed interviews</p>
                </div>
                <Star className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Follow-ups</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingFollowUps}</p>
                  <p className="text-xs text-gray-500">Candidates awaiting next steps</p>
                </div>
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Interview Log */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Interview Log</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {interview.candidate.avatar}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {interview.candidate.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {interview.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {interview.interviewer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(interview.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {renderStars(interview.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {interview.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}