import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const JobFairDashboard = () => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshQueue = () => {
    setLoading(true);
    axios
      .get('{{base_url}}/job-fairs/1/queues/student/21')
      .then(res => {
        setQueueData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading queue data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshQueue();
  }, []);

  const queuePosition = queueData?.queue_position ?? 0;
  const waitTime = queueData?.estimated_wait_time ?? 0;
  const schedule = queueData?.schedule || [];
  const nextInterview = queueData?.next_interview || null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Queue Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Queue Status</h2>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  In Queue
                </span>
              </div>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-lg flex items-center justify-center rotate-12">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {queueData?.company_name || 'Waiting'}
                    </h3>
                    <p className="text-gray-600">Current Position</p>
                  </div>
                  <div className="text-6xl font-bold text-orange-500">
                    {queuePosition}
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Estimated Wait Time</p>
                    <p className="text-3xl font-bold">{waitTime} min</p>
                  </div>
                  <button
                    onClick={refreshQueue}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Refresh Status</span>
                  </button>
                </div>
              )}
            </div>

            {/* Job Fair Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Job Fair Schedule</h2>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  Today
                </span>
              </div>
              <div className="space-y-3">
                {schedule.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No scheduled interviews
                  </p>
                ) : (
                  schedule.map((company, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {company.logo || company.name?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <p className="text-sm text-gray-600">
                            {(company.times || []).join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        Booth {company.booth}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-4 text-orange-600 text-sm font-medium">
                View All Companies →
              </button>
            </div>
          </div>

          {/* Next Interview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Next Interview</h2>
            <p className="text-gray-600 mb-4">
              Your upcoming scheduled interview
            </p>

            {nextInterview ? (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {nextInterview.name?.[0] || 'C'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {nextInterview.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Time</span>
                        <p className="font-semibold">{nextInterview.time}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Interviewer</span>
                        <p className="font-semibold">
                          {nextInterview.interviewer}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location</span>
                        <p className="font-semibold">
                          {nextInterview.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                    View Company →
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No upcoming interview</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobFairDashboard;
