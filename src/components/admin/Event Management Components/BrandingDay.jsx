'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Building2,
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

const BrandingDay = ({ event }) => {
  const jobFairId = event?.id; // Get jobFairId from event prop
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
  const [brandingDayDate, setBrandingDayDate] = useState('2025-06-25'); // State for the single branding day date
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');

  // Add the missing scheduleData state
  const [scheduleData, setScheduleData] = useState({
    branding_day_date: '',
    slots: [],
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Authentication check and data fetching
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

    // Fetch data only if jobFairId is available and user is admin
    if (jobFairId && storedRole === 'admin') {
      fetchData();
    } else if (!jobFairId) {
      setLoading(false);
      setError('Event ID not provided for Branding Day.');
    }
  }, [jobFairId, userRole]); // Add jobFairId to dependencies

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (userRole !== 'admin' || !jobFairId) return;

    const interval = setInterval(
      () => {
        fetchData();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [jobFairId, userRole]); // Add jobFairId to dependencies

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

      // Ensure jobFairId is available before fetching
      if (!jobFairId) {
        setLoading(false);
        setError('Event ID not provided for Branding Day.');
        return;
      }

      // Fetch candidates first
      const candidatesResponse = await fetch(
        `${BASE_URL}/api/job-fairs/${jobFairId}/branding-day/candidates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!candidatesResponse.ok) {
        if (candidatesResponse.status === 404) {
          // No candidates found, set empty array and continue
          setCandidates([]);
          setSchedule([]);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
        throw new Error(
          `Failed to fetch candidates: ${candidatesResponse.status}`
        );
      }

      const candidatesData = await candidatesResponse.json();

      // Fetch schedule
      const scheduleResponse = await fetch(
        `${BASE_URL}/api/job-fairs/${jobFairId}/branding-day/schedule`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let scheduleData = { success: true, data: { result: [] } }; // Default empty schedule
      if (scheduleResponse.ok) {
        scheduleData = await scheduleResponse.json();
      } else if (scheduleResponse.status === 404) {
        console.log(
          'No schedule found (404), initializing with empty schedule.'
        );
        // Continue without throwing an error, scheduleData remains default empty
      } else {
        console.warn(
          `Schedule fetch failed with status: ${scheduleResponse.status}`
        );
        // Don't throw error, just use empty schedule
      }

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
        // Set empty schedule if fetch failed
        setSchedule([]);
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
    // Initialize scheduleData.slots with the candidate's info
    setScheduleData({
      branding_day_date: brandingDayDate, // Use the selected brandingDayDate
      slots: [
        {
          company_id: candidate.company_id,
          participation_id: candidate.job_fair_participation_id,
          company_name: candidate.company_name,
          speaker: candidate.speaker,
          start_time: '09:00', // Default start time
          end_time: '09:30', // Default end time
          order: schedule.length + 1, // Default order
        },
      ],
    });
    console.log('Attempting to show schedule form modal.'); // Added console.log
    setShowScheduleForm(true); // Open the modal
    setActionError(''); // Clear any previous errors
    setActionSuccess(''); // Clear any previous success messages
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
      branding_day_date: brandingDayDate, // Use the selected brandingDayDate
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
          branding_day_date: brandingDayDate, // Use the selected brandingDayDate
          start_time: slot.start_time,
          end_time: slot.end_time,
          order: slot.order,
          speaker_id: slot.speaker?.id || null, // Ensure speaker_id is sent if available
        })),
      };

      console.log('Submitting schedule:', payload);

      const response = await fetch(
        `${BASE_URL}/api/job-fairs/${jobFairId}/branding-day/schedule`,
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
        // Reset scheduleData
        setScheduleData({
          branding_day_date: '',
          slots: [],
        });
        fetchData(); // Re-fetch data to get actual IDs and updated schedule
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
        order: editingSlot.order, // Allow updating order
        branding_day_date: editingSlot.branding_day_date, // Allow updating date
        branding_day_speaker_id: editingSlot.speaker?.id || null, // Allow updating speaker
      };

      console.log('Updating slot:', editingSlot.id, payload);
      const response = await fetch(
        `${BASE_URL}/api/job-fairs/${jobFairId}/branding-day/schedule/${editingSlot.id}`,
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
        fetchData(); // Re-fetch data to get updated schedule
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
        `${BASE_URL}/api/job-fairs/${jobFairId}/branding-day/schedule/${deletingSlot.id}`,
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

  const handlePhotoClick = photoUrl => {
    setSelectedPhotoUrl(photoUrl);
    setShowPhotoModal(true);
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
                onClick={handleRefresh}
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

        {/* Branding Day Date Selector */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Set Branding Day Date
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="date"
              value={brandingDayDate}
              onChange={e => setBrandingDayDate(e.target.value)}
              className="flex-1 w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-lg font-medium"
              required
            />
            <button
              onClick={() => {
                // Optionally trigger a re-fetch or simply update UI based on new date
                setActionSuccess(`Branding Day Date set to ${brandingDayDate}`);
              }}
              className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-6 py-3 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
            >
              Set Date
            </button>
          </div>
        </div>

        {/* Enhanced Available Companies Grid */}
        {unscheduledCandidates.length > 0 ? (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white rounded-2xl shadow-lg border border-gray-100">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 text-left">
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm rounded-tl-2xl"></th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                    Company Name
                  </th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                    Speaker
                  </th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                    Position
                  </th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                    Mobile
                  </th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                    Photo
                  </th>
                  <th className="p-4 text-gray-600 font-bold uppercase text-sm rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {unscheduledCandidates.map(candidate => (
                  <tr
                    key={candidate.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
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
                              selectedCompanies.filter(
                                c => c.id !== candidate.id
                              )
                            );
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-[#901b20] focus:ring-[#901b20]"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {candidate.company_name}
                    </td>
                    <td className="p-4 text-gray-700">
                      {candidate.speaker?.speaker_name || 'N/A'}
                    </td>
                    <td className="p-4 text-gray-700">
                      {candidate.speaker?.position || 'N/A'}
                    </td>
                    <td className="p-4 text-gray-700">
                      {candidate.speaker?.mobile || 'N/A'}
                    </td>
                    <td className="p-4">
                      {candidate.speaker?.photo ? (
                        <img
                          src={candidate.speaker.photo || '/placeholder.svg'}
                          alt={candidate.speaker.speaker_name}
                          className="w-12 h-12 rounded-full object-cover cursor-pointer"
                          onClick={() =>
                            handlePhotoClick(candidate.speaker.photo)
                          }
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleScheduleCompany(candidate)}
                        className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <span className="relative flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Now
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-16 text-center shadow-lg animate-fade-in mb-12 border border-gray-100">
            <div className="text-gray-300 mb-8 animate-float">
              <CheckCircle className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {candidates.length === 0
                ? 'No companies available'
                : 'All companies scheduled!'}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {candidates.length === 0
                ? 'No companies with speakers found for this job fair'
                : 'All available companies have been scheduled for branding day'}
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

            <div className="overflow-x-auto p-6">
              <table className="min-w-full bg-white rounded-2xl shadow-lg border border-gray-100">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 text-left">
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm rounded-tl-2xl">
                      Order
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                      Company Name
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                      Speaker
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                      Date
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                      Time Slot
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm">
                      Photo
                    </th>
                    <th className="p-4 text-gray-600 font-bold uppercase text-sm rounded-tr-2xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedule
                    .sort((a, b) => a.order - b.order)
                    .map(slot => (
                      <tr
                        key={slot.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-bold text-gray-900">
                          {slot.order}
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          {slot.company_name}
                        </td>
                        <td className="p-4 text-gray-700">
                          {slot.speaker?.speaker_name || 'N/A'}
                        </td>
                        <td className="p-4 text-gray-700">
                          {slot.branding_day_date}
                        </td>
                        <td className="p-4 text-gray-700">
                          {formatTime(slot.start_time)} -{' '}
                          {formatTime(slot.end_time)}
                        </td>
                        <td className="p-4">
                          {slot.speaker?.photo ? (
                            <img
                              src={slot.speaker.photo || '/placeholder.svg'}
                              alt={slot.speaker.speaker_name}
                              className="w-12 h-12 rounded-full object-cover cursor-pointer"
                              onClick={() =>
                                handlePhotoClick(slot.speaker.photo)
                              }
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditSlot(slot)}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-all duration-300 text-blue-600"
                            title="Edit slot"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(slot)}
                            className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-300 text-red-600"
                            title="Delete slot"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
        {showScheduleForm && scheduleData && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  Schedule Branding Day Slots
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setScheduleData({ branding_day_date: '', slots: [] });
                  }}
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
                  {/* Add error message inside modal */}
                  {actionError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{actionError}</span>
                      </div>
                    </div>
                  )}

                  {/* Add success message inside modal */}
                  {actionSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>{actionSuccess}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-8">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Branding Day Date
                      </label>
                      <input
                        type="date"
                        value={brandingDayDate} // Use the state variable
                        onChange={e => setBrandingDayDate(e.target.value)} // Update the state variable
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
                      onClick={() => {
                        setShowScheduleForm(false);
                        setScheduleData({ branding_day_date: '', slots: [] });
                      }}
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
                {/* Add error message inside edit modal */}
                {actionError && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{actionError}</span>
                    </div>
                  </div>
                )}

                {/* Add success message inside edit modal */}
                {actionSuccess && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">{actionSuccess}</span>
                    </div>
                  </div>
                )}

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

        {/* Photo Enlargement Modal */}
        {showPhotoModal && selectedPhotoUrl && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Speaker Photo
                </h2>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center">
                <img
                  src={selectedPhotoUrl || '/placeholder.svg'}
                  alt="Enlarged Speaker Photo"
                  className="max-w-full max-h-[80vh] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
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
