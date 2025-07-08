import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';

const JobFairDashboard = () => {
  const [allQueuesData, setAllQueuesData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Get user ID from props, context, or authentication state
  // For now, using a placeholder - replace with actual user ID source
  const userId = 96; // Replace this with actual user ID from your auth system

  const fetchQueueData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/job-fairs/1/queues/student/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch queue data');
      }
      const result = await response.json();
      
      // Extract queue data from the new API response structure
      const queuesArray = result.success && result.data && result.data.queue 
        ? result.data.queue 
        : [];
      
      setAllQueuesData(queuesArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, [userId]);

  const refreshCurrentQueue = () => {
    fetchQueueData();
  };

  const currentQueue = allQueuesData[activeTab];

  // Format time for display
  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 'TBD';
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Job Fair Dashboard</h1>
            <p className="text-orange-100">Your interviews for today</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your interviews...</p>
            </div>
          ) : allQueuesData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No interviews scheduled for today</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {allQueuesData.map((queueItem, index) => (
                    <button
                      key={queueItem.queue_id}
                      onClick={() => setActiveTab(index)}
                      className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === index
                          ? 'border-orange-500 text-orange-600 bg-orange-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          {queueItem.company?.logo_path ? (
                            <img
                              src={queueItem.company.logo_path}
                              alt={queueItem.company.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-orange-500 text-sm font-bold">
                              {queueItem.company?.name?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{queueItem.company?.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(queueItem.slot?.start_time, queueItem.slot?.end_time)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {currentQueue && (
                  <div className="max-w-2xl mx-auto">
                    {/* Company Info */}
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        {currentQueue.company?.logo_path ? (
                          <img
                            src={currentQueue.company.logo_path}
                            alt={currentQueue.company.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-orange-500 text-2xl font-bold">
                            {currentQueue.company?.name?.[0]}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {currentQueue.company?.name}
                      </h2>
                      <div className="flex justify-center gap-4 text-sm text-gray-600">
                        <span>📅 {formatDate(currentQueue.slot?.date)}</span>
                        <span>🕐 {formatTime(currentQueue.slot?.start_time, currentQueue.slot?.end_time)}</span>
                      </div>
                    </div>

                    {/* Queue Status */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="text-3xl font-bold text-orange-500 mb-2">
                            {currentQueue.queue_position}
                          </div>
                          <div className="text-gray-600 text-sm">Your Position</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="text-3xl font-bold text-blue-500 mb-2">
                            {currentQueue.queue_position > 0 ? currentQueue.queue_position - 1 : 0}
                          </div>
                          <div className="text-gray-600 text-sm">People Before You</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="text-3xl font-bold text-green-500 mb-2">
                            {currentQueue.queue_position <= 1 ? '0-5' : Math.ceil(currentQueue.queue_position * 15)}
                          </div>
                          <div className="text-gray-600 text-sm">Minutes Wait</div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-center mb-6">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        currentQueue.status === 'waiting' && currentQueue.queue_position === 1
                          ? 'bg-green-100 text-green-800'
                          : currentQueue.status === 'waiting'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentQueue.queue_position === 1 ? '🎯 Next in line!' : 
                         currentQueue.status === 'waiting' ? '⏳ In Queue' : 
                         `📋 ${currentQueue.status.charAt(0).toUpperCase() + currentQueue.status.slice(1)}`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Queue Progress</span>
                        <span>
                          {currentQueue.queue_position > 0 ? 
                            Math.round(((currentQueue.order_key) / (currentQueue.order_key + currentQueue.queue_position)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${currentQueue.queue_position > 0 ? 
                              ((currentQueue.order_key) / (currentQueue.order_key + currentQueue.queue_position)) * 100 
                              : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {currentQueue.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">Notes:</h3>
                        <p className="text-blue-700">{currentQueue.notes}</p>
                      </div>
                    )}

                    {/* Refresh Button */}
                    <div className="text-center">
                      <button
                        onClick={refreshCurrentQueue}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh Status</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default JobFairDashboard;