import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const JobFairDashboard = () => {
  const [queuePosition, setQueuePosition] = useState(7);
  const [waitTime, setWaitTime] = useState(25);

  const companies = [
    {
      name: 'Innovate Corp.',
      times: ['9:30 AM', '1:00 PM', '2:00 PM'],
      booth: '5',
      logo: 'I',
    },
    {
      name: 'Global Dynamics',
      times: ['9:30 AM', '1:00 PM', '4:00 PM'],
      booth: '22',
      logo: 'G',
    },
    {
      name: 'Quantum Systems',
      times: ['10:00 AM', '1:00 PM'],
      booth: '10',
      logo: 'Q',
    },
    {
      name: 'Phoenix Solutions',
      times: ['10:30 AM', '2:00 PM'],
      booth: '8',
      logo: 'P',
    },
    {
      name: 'Nexus Technologies',
      times: ['11:00 AM', '2:30 PM'],
      booth: '18',
      logo: 'N',
    },
  ];

  const refreshQueue = () => {
    setQueuePosition(Math.max(1, queuePosition - 1));
    setWaitTime(Math.max(5, waitTime - 3));
  };

  return (
    <div
      className="bg-gray-50 w-375 flex flex-col"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <div className="flex flex-1">
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

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-lg flex items-center justify-center transform rotate-12">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Innovate Corp.</h3>
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
            </div>

            {/* Job Fair Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Job Fair Schedule</h2>
                <div className="flex space-x-2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    Today
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {companies.map((company, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {company.logo}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{company.name}</h4>
                        <p className="text-sm text-gray-600">
                          {company.times.join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      Booth {company.booth}
                    </span>
                  </div>
                ))}
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

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">TechSolutions Inc.</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Time</span>
                      <p className="font-semibold">10:30 AM - 11:00 AM</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Interviewer</span>
                      <p className="font-semibold">Sarah Chen</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location</span>
                      <p className="font-semibold">Booth 15, Main Hall</p>
                    </div>
                  </div>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                  View Company →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobFairDashboard;
