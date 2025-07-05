import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/student/Layout';
import Footer from '../../components/student/Footer';

const JobFairDashboard = () => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshQueue = () => {
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/api/job-fairs/1/queues/student/2')
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

  return (
    <Layout>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Job Fair Schedule - moved to the left */}
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Job Fair Schedule
              </h2>
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Today
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {schedule.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  No scheduled interviews
                </p>
              ) : (
                schedule.map((company, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        {/* شعار الشركة أو أول حرف */}
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-orange-500 text-2xl font-bold">
                            {company.name?.[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {company.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {(company.times || []).join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">
                      Booth {company.booth}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full mt-4 text-orange-600 text-sm font-semibold flex items-center justify-center gap-1"
              onClick={() => navigate('/company-directory')}
            >
              View All Companies <span aria-hidden>→</span>
            </button>
          </div>

          {/* Queue Status - moved to the right */}
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Your Queue Status
            </h2>
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              In Queue
            </span>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <>
                <div className="mb-2">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center">
                    <span className="text-5xl">
                      {queueData?.company_logo ? (
                        <img
                          src={queueData.company_logo}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        queueData?.company_name?.[0] || 'C'
                      )}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {queueData?.company_name || 'Waiting'}
                </h3>
                <p className="text-gray-600 mb-2">Current Position</p>
                <div className="text-6xl font-extrabold text-orange-500 mb-2">
                  {queuePosition}
                </div>
                <p className="text-gray-600 mb-1">Estimated Wait Time</p>
                <div className="text-3xl font-bold mb-4">{waitTime} min</div>
                <button
                  onClick={refreshQueue}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mx-auto border border-gray-200 px-4 py-2 rounded transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh Status</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default JobFairDashboard;
