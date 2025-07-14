'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Building2,
  Phone,
  User,
  Save,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Edit3,
  X,
  Plus,
  Loader2,
  TrendingUp,
} from 'lucide-react';

const BrandingDay = () => {
  const [candidates, setCandidates] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userRole, setUserRole] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    branding_day_date: '2025-06-25',
    slots: [],
  });

  const APP_URL = import.meta.env.VITE_API_BASE_URL;

  // Authentication check
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedRole || !storedUser || !storedToken) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    if (storedRole !== 'admin') {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    setUserRole(storedRole);
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (userRole !== 'admin') return;

    const interval = setInterval(
      () => {
        fetchData();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [userRole]);

  // Auto-hide success/error messages
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionError('');
      const token = localStorage.getItem('token');

      if (!token) {
        setAccessDenied(true);
        return;
      }

      // Fetch candidates
      const candidatesResponse = await fetch(
        `${APP_URL}/job-fairs/1/branding-day/candidates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!candidatesResponse.ok) {
        throw new Error(`HTTP error! status: ${candidatesResponse.status}`);
      }

      const candidatesData = await candidatesResponse.json();

      // Fetch schedule
      const scheduleResponse = await fetch(
        `${APP_URL}/job-fairs/1/branding-day/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!scheduleResponse.ok) {
        throw new Error(`HTTP error! status: ${scheduleResponse.status}`);
      }

      const scheduleData = await scheduleResponse.json();

      if (candidatesData.success) {
        setCandidates(candidatesData.data.result || []);
      } else {
        throw new Error(candidatesData.message || 'Failed to fetch candidates');
      }

      if (scheduleData.success) {
        // Merge speaker data from candidates into schedule
        const scheduleWithSpeakers = scheduleData.data.result.map(slot => {
          const candidate = candidatesData.data.result?.find(
            c => c.company_id === slot.company_id
          );
          return {
            ...slot,
            speaker: candidate?.speaker || null,
          };
        });
        setSchedule(scheduleWithSpeakers || []);
      } else {
        throw new Error(scheduleData.message || 'Failed to fetch schedule');
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Error loading branding day data');
    } finally {
      setLoading(false);
    }
  };

  // Get unscheduled companies
  const unscheduledCandidates = candidates.filter(
    candidate =>
      !schedule.some(slot => slot.company_id === candidate.company_id) &&
      candidate.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleCompany = candidate => {
    setSelectedCompanies([candidate]);
    setScheduleData({
      branding_day_date: '2025-06-25',
      slots: [
        {
          company_id: candidate.company_id,
          participation_id: candidate.job_fair_participation_id,
          company_name: candidate.company_name,
          speaker: candidate.speaker,
          start_time: '09:00',
          end_time: '09:30',
          order: schedule.length + 1,
        },
      ],
    });
    setShowScheduleForm(true);
  };

  const handleBulkSchedule = () => {
    if (selectedCompanies.length === 0) return;

    const slots = selectedCompanies.map((candidate, index) => {
      const startHour = 9 + Math.floor(index * 0.5);
      const startMinute = (index % 2) * 30;
      const endHour = 9 + Math.floor((index + 1) * 0.5);
      const endMinute = ((index + 1) % 2) * 30;

      return {
        company_id: candidate.company_id,
        participation_id: candidate.job_fair_participation_id,
        company_name: candidate.company_name,
        speaker: candidate.speaker,
        start_time: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        end_time: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
        order: schedule.length + index + 1,
      };
    });

    setScheduleData({
      branding_day_date: '2025-06-25',
      slots,
    });
    setShowScheduleForm(true);
  };

  const updateSlotTime = (index, field, value) => {
    const updatedSlots = [...scheduleData.slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setScheduleData({ ...scheduleData, slots: updatedSlots });
  };

  const removeSlot = index => {
    const updatedSlots = scheduleData.slots.filter((_, i) => i !== index);
    setScheduleData({ ...scheduleData, slots: updatedSlots });
  };

  const handleSubmitSchedule = async e => {
    e.preventDefault();
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        schedule: scheduleData.slots.map(slot => ({
          company_id: slot.company_id,
          participation_id: slot.participation_id,
          branding_day_date: scheduleData.branding_day_date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          order: slot.order,
        })),
      };

      console.log('Submitting schedule:', payload);

      const response = await fetch(
        `${APP_URL}/job-fairs/1/branding-day/schedule`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log('Schedule response:', data);

      if (data.success) {
        setActionSuccess('Schedule created successfully! 🎉');
        setShowScheduleForm(false);
        setSelectedCompanies([]);

        // Create new schedule slots with proper structure
        const newScheduleSlots = scheduleData.slots.map((slot, index) => ({
          id: `temp_${Date.now()}_${index}`, // Temporary ID
          company_id: slot.company_id,
          participation_id: slot.participation_id,
          company_name: slot.company_name,
          speaker: slot.speaker,
          start_time: slot.start_time,
          end_time: slot.end_time,
          order: slot.order,
          branding_day_date: scheduleData.branding_day_date,
        }));

        // Update schedule state
        setSchedule(prevSchedule => [...prevSchedule, ...newScheduleSlots]);

        console.log('Updated schedule with new slots:', newScheduleSlots);

        // Don't automatically refresh - let user manually refresh if needed
        // This prevents the optimistic update from being overwritten
      } else {
        setActionError(data.message || 'Failed to create schedule');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setActionError('Network error occurred while creating the schedule');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSlot = slot => {
    console.log('Edit slot clicked:', slot);
    setEditingSlot({
      ...slot,
      start_time: slot.start_time.substring(0, 5), // Remove seconds
      end_time: slot.end_time.substring(0, 5), // Remove seconds
    });
    setShowEditModal(true);
    setActionSuccess('');
    setActionError('');
  };

  const handleUpdateSlot = async e => {
    e.preventDefault();
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        start_time: editingSlot.start_time,
        end_time: editingSlot.end_time,
      };

      console.log('Updating slot:', editingSlot.id, payload);

      const response = await fetch(
        `${APP_URL}/job-fairs/1/branding-day/schedule/${editingSlot.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        setActionSuccess('Schedule updated successfully! ✅');
        setShowEditModal(false);

        // Update local state immediately
        setSchedule(prevSchedule =>
          prevSchedule.map(slot =>
            slot.id === editingSlot.id
              ? {
                  ...slot,
                  start_time: editingSlot.start_time,
                  end_time: editingSlot.end_time,
                }
              : slot
          )
        );

        setEditingSlot(null);
      } else {
        setActionError(data.message || 'Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      setActionError('Network error occurred while updating the schedule');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = slot => {
    console.log('Delete slot clicked:', slot);
    setDeletingSlot(slot);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSlot) return;

    setActionLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const token = localStorage.getItem('token');
      console.log('Deleting slot:', deletingSlot.id);

      const response = await fetch(
        `${APP_URL}/job-fairs/1/branding-day/schedule/${deletingSlot.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Delete response:', data);

      if (data.success) {
        // Create candidate object from the deleted slot to add back to available companies
        const restoredCandidate = {
          id: deletingSlot.company_id,
          company_id: deletingSlot.company_id,
          job_fair_participation_id: deletingSlot.participation_id,
          company_name: deletingSlot.company_name,
          speaker: deletingSlot.speaker,
        };

        console.log('Restoring candidate:', restoredCandidate);

        // Update states immediately and atomically
        setSchedule(prevSchedule => {
          const updatedSchedule = prevSchedule.filter(
            slot => slot.id !== deletingSlot.id
          );
          console.log('Updated schedule after deletion:', updatedSchedule);
          return updatedSchedule;
        });

        // Add the company back to candidates
        setCandidates(prevCandidates => {
          const exists = prevCandidates.some(
            c => c.company_id === restoredCandidate.company_id
          );
          if (!exists) {
            const updatedCandidates = [...prevCandidates, restoredCandidate];
            console.log(
              'Updated candidates after restoration:',
              updatedCandidates
            );
            return updatedCandidates;
          }
          return prevCandidates;
        });

        // Close modal and reset states
        setShowDeleteModal(false);
        setDeletingSlot(null);
        setActionLoading(false);

        // Show success message
        setActionSuccess(
          'Schedule slot deleted successfully! Company moved back to available list. 🗑️'
        );

        console.log('Delete operation completed successfully');
      } else {
        setActionError(data.message || 'Failed to delete schedule slot');
        setActionLoading(false);
      }
    } catch (error) {
      console.error('Error deleting schedule slot:', error);
      setActionError('Network error occurred while deleting the schedule slot');
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    fetchData();
  };

  const formatTime = timeString => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Remove seconds
  };

  // Enhanced Loading Component
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-300 border border-gray-200 rounded w-1/4 mb-6 shimmer-effect"></div>
              <div className="h-4 bg-gray-300 border border-gray-200 rounded w-1/2 shimmer-effect"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 space-y-4 shimmer-effect border border-gray-200"
                >
                  <div className="h-6 bg-gray-300 border border-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 border border-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>

            {/* Search skeleton */}
            <div className="bg-white rounded-lg p-6 mb-8 shimmer-effect border border-gray-200">
              <div className="h-10 bg-gray-300 border border-gray-200 rounded"></div>
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 space-y-4 shimmer-effect border border-gray-200"
                >
                  <div className="h-4 bg-gray-300 border border-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 border border-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-300 border border-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error Component
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl animate-shake border border-gray-200">
              <div className="text-red-500 mb-6 animate-bounce">
                <AlertCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Error Loading Branding Day
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Access Denied Component
  if (accessDenied) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl border border-gray-200">
              <div className="text-red-500 mb-6">
                <AlertCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Access Denied
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Admin access
                required.
              </p>
              <button
                onClick={() => (window.location.href = '/login')}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        {/* Success/Error Messages */}
        {actionSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{actionSuccess}</span>
            </div>
          </div>
        )}

        {actionError && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{actionError}</span>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-primary bg-gradient-to-r from-[#901b20] to-[#901b20] bg-clip-text text-transparent mb-2">
                Branding Day Schedule
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Schedule branding day slots for approved companies with speakers
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                )}
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Available Companies
              </p>
              <p className="text-3xl font-black text-primary animate-pulse">
                {unscheduledCandidates.length}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Scheduled
              </p>
              <p className="text-3xl font-black text-green-600 animate-pulse">
                {schedule.length}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Total Speakers
              </p>
              <p className="text-3xl font-black text-purple-600">
                {candidates.length}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Completion
              </p>
              <p className="text-3xl font-black text-[#901b20]">
                {candidates.length > 0
                  ? Math.round((schedule.length / candidates.length) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search companies by name, speaker, or position..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {selectedCompanies.length > 0 && (
              <button
                onClick={handleBulkSchedule}
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold"
              >
                <Plus className="w-5 h-5" />
                Schedule Selected ({selectedCompanies.length})
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Available Companies Grid */}
        {unscheduledCandidates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {unscheduledCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left flex flex-col h-full border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Company Banner */}
                <div className="h-48 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                  {candidate.speaker?.photo ? (
                    <img
                      src={candidate.speaker.photo || '/placeholder.svg'}
                      alt={candidate.speaker.speaker_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>
                  )}

                  {/* Enhanced Status Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-sm bg-green-100 text-green-800 border-green-200 shadow-lg">
                      Available
                    </span>
                  </div>

                  {/* Checkbox */}
                  <div className="absolute top-6 left-6">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.some(
                        c => c.id === candidate.id
                      )}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCompanies([
                            ...selectedCompanies,
                            candidate,
                          ]);
                        } else {
                          setSelectedCompanies(
                            selectedCompanies.filter(c => c.id !== candidate.id)
                          );
                        }
                      }}
                      className="w-5 h-5 rounded border-white/30 text-[#901b20] focus:ring-white/50 bg-white/20"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-[#203947] mb-4 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300 h-14 flex items-start">
                    {candidate.company_name}
                  </h3>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      <div className="w-10 h-10 bg-[#901b20]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                        <User className="w-5 h-5 text-[#901b20]" />
                      </div>
                      <span className="font-medium truncate">
                        {candidate.speaker?.speaker_name}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      <div className="w-10 h-10 bg-[#203947]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                        <Building2 className="w-5 h-5 text-[#203947]" />
                      </div>
                      <span className="font-medium truncate">
                        {candidate.speaker?.position}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      <div className="w-10 h-10 bg-[#ad565a]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                        <Phone className="w-5 h-5 text-[#ad565a]" />
                      </div>
                      <span className="font-medium">
                        {candidate.speaker?.mobile}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <div className="text-sm text-gray-500 font-medium">
                      Ready to schedule
                    </div>

                    <button
                      onClick={() => handleScheduleCompany(candidate)}
                      className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule Now
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-16 text-center shadow-lg animate-fade-in mb-12 border border-gray-100">
            <div className="text-gray-300 mb-8 animate-float">
              <CheckCircle className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              All companies scheduled!
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              All available companies have been scheduled for branding day
            </p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Refresh Data
            </button>
          </div>
        )}

        {/* Enhanced Current Schedule */}
        {schedule.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Current Schedule
              </h2>
              <p className="text-gray-600 mt-1">Scheduled branding day slots</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {schedule
                  .sort((a, b) => a.order - b.order)
                  .map((slot, index) => (
                    <div
                      key={slot.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left flex flex-col h-full border border-gray-100"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Enhanced Schedule Banner */}
                      <div className="h-48 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                        {slot.speaker?.photo ? (
                          <img
                            src={slot.speaker.photo || '/placeholder.svg'}
                            alt={slot.speaker.speaker_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                          </div>
                        )}

                        {/* Enhanced Slot Badge */}
                        <div className="absolute top-6 right-6">
                          <span className="px-4 py-2 rounded-full text-sm font-bold border-2 backdrop-blur-sm bg-blue-100 text-blue-800 border-blue-200 shadow-lg">
                            Slot #{slot.order}
                          </span>
                        </div>

                        {/* Action Buttons - Fixed with proper event handling */}
                        <div className="absolute top-6 left-6 flex gap-2 z-10">
                          <button
                            type="button"
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                'Edit button clicked for slot:',
                                slot
                              );
                              handleEditSlot(slot);
                            }}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/40"
                            title="Edit slot"
                          >
                            <Edit3 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                'Delete button clicked for slot:',
                                slot
                              );
                              handleDeleteClick(slot);
                            }}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/40"
                            title="Delete slot"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-black text-[#203947] mb-4 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300 h-14 flex items-start">
                          {slot.company_name}
                        </h3>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            <div className="w-10 h-10 bg-[#901b20]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                              <User className="w-5 h-5 text-[#901b20]" />
                            </div>
                            <span className="font-medium truncate">
                              {slot.speaker?.speaker_name || 'Speaker TBD'}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            <div className="w-10 h-10 bg-[#203947]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                              <Clock className="w-5 h-5 text-[#203947]" />
                            </div>
                            <span className="font-medium font-mono">
                              {formatTime(slot.start_time)} -{' '}
                              {formatTime(slot.end_time)}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            <div className="w-10 h-10 bg-[#ad565a]/10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                              <Calendar className="w-5 h-5 text-[#ad565a]" />
                            </div>
                            <span className="font-medium">
                              {slot.branding_day_date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                          <div className="text-sm text-gray-500 font-medium">
                            {slot.speaker?.position || 'Position TBD'}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-600">
                              Scheduled
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingSlot && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
              <div className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Delete Schedule Slot
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Are you sure you want to delete the schedule slot for{' '}
                  <span className="font-bold text-[#901b20]">
                    {deletingSlot.company_name}
                  </span>
                  ?
                  <br />
                  <span className="text-sm text-gray-500 mt-2 block">
                    The company will be moved back to the available list.
                  </span>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      console.log('Cancel delete clicked');
                      setShowDeleteModal(false);
                      setDeletingSlot(null);
                      setActionError('');
                      setActionSuccess('');
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log('Confirm delete clicked');
                      handleConfirmDelete();
                    }}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none font-bold text-lg"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Delete & Move Back
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  Schedule Branding Day Slots
                </h2>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={handleSubmitSchedule}
                className="flex-1 overflow-y-auto custom-scrollbar"
              >
                <div className="p-8">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Branding Day Date
                      </label>
                      <input
                        type="date"
                        value={scheduleData.branding_day_date}
                        onChange={e =>
                          setScheduleData({
                            ...scheduleData,
                            branding_day_date: e.target.value,
                          })
                        }
                        className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium w-full"
                        required
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Time Slots
                      </h3>
                      <div className="space-y-6">
                        {scheduleData.slots.map((slot, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white"
                          >
                            <div className="flex items-start gap-6">
                              <img
                                src={
                                  slot.speaker?.photo ||
                                  '/placeholder.svg?height=60&width=60'
                                }
                                alt={slot.speaker?.speaker_name}
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                              />
                              <div className="flex-1 space-y-6">
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900">
                                    {slot.company_name}
                                  </h4>
                                  <p className="text-lg text-gray-600">
                                    {slot.speaker?.speaker_name} -{' '}
                                    {slot.speaker?.position}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Start Time
                                    </label>
                                    <input
                                      type="time"
                                      value={slot.start_time}
                                      onChange={e =>
                                        updateSlotTime(
                                          index,
                                          'start_time',
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      End Time
                                    </label>
                                    <input
                                      type="time"
                                      value={slot.end_time}
                                      onChange={e =>
                                        updateSlotTime(
                                          index,
                                          'end_time',
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                      Order
                                    </label>
                                    <input
                                      type="number"
                                      value={slot.order}
                                      onChange={e =>
                                        updateSlotTime(
                                          index,
                                          'order',
                                          Number.parseInt(e.target.value)
                                        )
                                      }
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                                      min="1"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              {scheduleData.slots.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSlot(index)}
                                  className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 p-8 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                  <div className="flex items-center justify-end gap-6">
                    <button
                      type="button"
                      onClick={() => setShowScheduleForm(false)}
                      className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white transition-all duration-300 font-bold text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none font-bold text-lg"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        {actionLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {actionLoading ? 'Saving...' : 'Save Schedule'}
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingSlot && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Schedule Slot
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleUpdateSlot} className="p-8">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingSlot.company_name}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {editingSlot.branding_day_date}
                    </p>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={editingSlot.start_time}
                      onChange={e =>
                        setEditingSlot({
                          ...editingSlot,
                          start_time: e.target.value,
                        })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={editingSlot.end_time}
                      onChange={e =>
                        setEditingSlot({
                          ...editingSlot,
                          end_time: e.target.value,
                        })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white transition-all duration-300 font-bold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none font-bold text-lg"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      {actionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {actionLoading ? 'Updating...' : 'Update Slot'}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #901b20;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7a1619;
        }
      `}</style>
    </div>
  );
};

export default BrandingDay;
