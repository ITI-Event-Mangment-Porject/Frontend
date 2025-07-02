import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import NotificationStats from '../../components/admin/Notification/NotificationStats';
import NotificationFilter from '../../components/admin/Notification/NotificationFilter';
import NotificationTable from '../../components/admin/Notification/NotificationTable';
import NotificationDetail from '../../components/admin/Notification/NotificationDetail';
import NotificationForm from '../../components/admin/Notification/NotificationForm';
import { generateMockNotifications } from '../../utils/notificationUtils';
import Layout from '../../components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useScrollToTop();

  // Load mock notifications on component mount
  useEffect(() => {
    const mockData = generateMockNotifications();
    setNotifications(mockData);
    setFilteredNotifications(mockData);
  }, []);

  // Calculate statistics
  const totalCount = notifications.length;
  const successCount = notifications.filter(
    n => n.status.toLowerCase() === 'success'
  ).length;
  const failedCount = notifications.filter(
    n => n.status.toLowerCase() === 'failed'
  ).length;

  // Handle filter application
  const handleApplyFilters = filters => {
    let filtered = [...notifications];

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(searchLower) ||
          (n.message && n.message.toLowerCase().includes(searchLower))
      );
    }

    // Filter by status
    if (filters.status && filters.status !== 'All Notifications') {
      const statusLower = filters.status.toLowerCase();
      filtered = filtered.filter(n =>
        statusLower === 'successful'
          ? n.status.toLowerCase() === 'success'
          : n.status.toLowerCase() === statusLower
      );
    }

    // Filter by date range
    if (filters.dateRange.startDate) {
      const startDate = new Date(filters.dateRange.startDate);
      filtered = filtered.filter(n => {
        const notifDate = new Date(n.sentDate);
        return notifDate >= startDate;
      });
    }

    setFilteredNotifications(filtered);
  };

  // View notification details
  const handleViewDetails = notification => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  // Resend notification
  const handleResend = notification => {
    // In a real app, this would send the notification again
    alert(`Notification "${notification.title}" will be resent.`);
  };

  // Delete notification
  const handleDelete = notification => {
    if (
      window.confirm(`Are you sure you want to delete "${notification.title}"?`)
    ) {
      const updated = notifications.filter(n => n.id !== notification.id);
      setNotifications(updated);
      setFilteredNotifications(updated);
    }
  };

  // Create new notification
  const handleCreateNotification = newNotification => {
    const id =
      notifications.length > 0
        ? Math.max(...notifications.map(n => n.id)) + 1
        : 1;
    const completeNotification = {
      ...newNotification,
      id,
      recipients:
        newNotification.recipientType === 'specific'
          ? newNotification.specificRecipients.join(', ')
          : newNotification.recipientType === 'all'
            ? 'All Users'
            : `All ${newNotification.recipientType}`,
    };

    const updatedNotifications = [completeNotification, ...notifications];
    setNotifications(updatedNotifications);
    setFilteredNotifications(updatedNotifications);

    // Show success message
    alert('Notification created successfully!');
  };

  return (
    <Layout>
      <div className="p-4 m-1 sm:p-4 md:p-6 w-full min-h-screen bg-white flex flex-col animate-fade-in border border-[var(--gray-200)] rounded-lg shadow-md transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2  text-white rounded-md bg-[var(--primary-500)] hover:bg-[var(--primary-600)] flex items-center"
          >
            <FaPlus className="mr-2" />
            New Notification
          </button>
        </div>

        {/* Stats Cards */}
        <NotificationStats
          totalCount={totalCount}
          successCount={successCount}
          failedCount={failedCount}
        />

        {/* Filters */}
        <NotificationFilter onApplyFilters={handleApplyFilters} />

        {/* Notification Table */}
        <NotificationTable
          notifications={filteredNotifications}
          onViewDetails={handleViewDetails}
          onResend={handleResend}
          onDelete={handleDelete}
        />

        {/* Notification Detail Modal */}
        {isDetailOpen && (
          <NotificationDetail
            notification={selectedNotification}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedNotification(null);
            }}
          />
        )}

        {/* Notification Form Modal */}
        <NotificationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateNotification}
        />
      </div>
    </Layout>
  );
};

export default Notifications;
