import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Star, 
  Calendar,
  Clock,
  User,
  MapPin,
  Plus,
  Check,
  X
} from 'lucide-react';

export default function CandidateDetails() {
  const [interviewNotes, setInterviewNotes] = useState('');
  const [ratings, setRatings] = useState({
    overallImpression: 0,
    technicalSkill: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0
  });

  const [followUpActions, setFollowUpActions] = useState([
    { id: 1, text: 'Send thank you email', date: 'Due: 2024-06-25', completed: false },
    { id: 2, text: 'Schedule second interview with hiring manager', date: 'Due: 2024-06-26', completed: false },
    { id: 3, text: 'Review coding assignment', date: '', completed: true }
  ]);

  const feedbackHistory = [
    {
      date: 'July 25, 2024',
      interviewer: 'David Lee (HR)',
      rating: 4,
      feedback: 'Great initial screening. Strong communication skills and cultural alignment.'
    },
    {
      date: 'July 28, 2024',
      interviewer: 'Michael Johnson (Sr. Eng)',
      rating: 3,
      feedback: 'Technical skills are solid but needs improvement in system design.'
    },
    {
      date: 'July 30, 2024',
      interviewer: 'Emily White (Team Lead)',
      rating: 4,
      feedback: 'Excellent problem-solving approach and team collaboration mindset.'
    }
  ];

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const toggleFollowUp = (id) => {
    setFollowUpActions(prev => 
      prev.map(action => 
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const renderStars = (rating, interactive = false, category = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 cursor-pointer ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
        onClick={interactive ? () => handleRatingChange(category, i + 1) : undefined}
      />
    ));
  };

  const renderRatingSlider = (category, label, value) => {
    return (
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-4">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(value / 5) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 w-8">{value}/5</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Candidate Details</span>
          </button>
          <span className="text-gray-400">></span>
          <span className="text-sm text-gray-600">Olivia Carter</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="space-y-6">
            {/* Candidate Profile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  OC
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Olivia Carter</h2>
                  <p className="text-gray-600">Software Engineer</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+1 (917) 802-0534</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>olivia.carter@example.com</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Interviewing
                </span>
              </div>
            </div>

            {/* Interview Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium text-gray-900">July 31, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium text-gray-900">10:00 AM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interviewer:</span>
                  <span className="text-sm font-medium text-gray-900">Sarah Jenkins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium text-gray-900">Associate Writer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h3>
              
              <div className="space-y-4">
                {feedbackHistory.map((feedback, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{feedback.date}</span>
                      <span className="text-sm text-gray-600">- {feedback.interviewer}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-sm text-gray-600">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Notes and Ratings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Interview Notes</h3>
                <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                  Save Notes
                </button>
              </div>
              
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Type your detailed interview notes here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>

            {/* Candidate Ratings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Candidate Ratings</h3>
                <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                  Submit Ratings
                </button>
              </div>

              <div className="space-y-1">
                <div className="pb-4 mb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Impression</span>
                    <div className="flex items-center gap-2">
                      {renderStars(ratings.overallImpression, true, 'overallImpression')}
                      <span className="text-sm text-gray-600 ml-2">0/5</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-700 mb-3">Specific Criteria</h4>
                
                {renderRatingSlider('technicalSkill', 'Technical Skill', ratings.technicalSkill)}
                {renderRatingSlider('communication', 'Communication', ratings.communication)}
                {renderRatingSlider('problemSolving', 'Problem Solving', ratings.problemSolving)}
                {renderRatingSlider('culturalFit', 'Cultural Fit', ratings.culturalFit)}
              </div>
            </div>

            {/* Follow-Up Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Follow-Up Actions</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Action
                </button>
              </div>

              <div className="space-y-3">
                {followUpActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFollowUp(action.id)}
                      className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center ${
                        action.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {action.completed && <Check className="w-3 h-3" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm ${action.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {action.text}
                      </p>
                      {action.date && (
                        <p className="text-xs text-gray-500 mt-1">{action.date}</p>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}