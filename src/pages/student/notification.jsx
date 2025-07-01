import React, { useEffect, useState } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000';

const NotificationPage = () => {
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotificationsList(Array.isArray(data.data) ? data.data : []);
    } catch {
      setNotificationsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
     
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Your Notifications</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : notificationsList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No notifications yet</p>
                </div>
              ) : (
                notificationsList.map((notif, idx) => (
                  <div
                    key={notif.id || idx}
                    className="p-4 rounded border-l-4 border-orange-500 bg-orange-50"
                  >
                    <div>
                      <p className="font-medium">
                        {notif.title || 'Notification'}
                      </p>
                      <p className="text-gray-600 mb-1">
                        {notif.body || notif.message || ''}
                      </p>
                      <span className="text-sm text-gray-500">
                        {notif.created_at
                          ? new Date(notif.created_at).toLocaleString()
                          : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t mt-auto">
        <div className="px-4 sm:px-6 py-4 text-center text-gray-600 max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
