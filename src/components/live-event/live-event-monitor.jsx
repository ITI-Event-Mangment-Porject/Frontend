'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  User,
  QrCode,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  PieChart,
  Activity,
  ChevronDown,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
} from 'recharts';

const LiveEventMonitor = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1)
  const [_, setTotalEvents] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const itemsPerPage = 6;

  // Static admin token as provided
  const ADMIN_TOKEN =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTE3ODU4MzYsImV4cCI6MTc1MTc4OTQzNiwibmJmIjoxNzUxNzg1ODM2LCJqdGkiOiJoOGVITmdJS014a1k1R0tlIiwic3ViIjoiMTYxIiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.6jL2A1wwpELv8AVELsj6Dfq7pyOL-N6EGdWcx0_r96A';

  const fetchAllActiveEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let allActiveEvents = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await fetch(
          `http://127.0.0.1:8000/api/events?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          const activeEventsFromPage = data.data.result.data.filter(
            event => event.status === 'published' || event.status === 'ongoing'
          );

          allActiveEvents = [...allActiveEvents, ...activeEventsFromPage];
          totalPages = data.data.result.last_page;
          currentPage++;
        } else {
          throw new Error(data.message || 'Failed to fetch events');
        }
      } while (currentPage <= totalPages);

      allActiveEvents.sort((a, b) => {
        if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
        if (b.status === 'ongoing' && a.status !== 'ongoing') return 1;

        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
      });

      setEvents(allActiveEvents);
      setTotalEvents(allActiveEvents.length);
    } catch (err) {
      setError(err.message || 'Error loading events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActiveEvents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || event.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedType]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const totalFilteredPages = Math.ceil(filteredEvents.length / itemsPerPage);

  // Analytics data for charts
  const analyticsData = useMemo(() => {
    const statusData = [
      {
        name: 'Published',
        value: events.filter(e => e.status === 'published').length,
        color: 'var(--primary-400)',
      },
      {
        name: 'Ongoing',
        value: events.filter(e => e.status === 'ongoing').length,
        color: '#10b981',
      },
    ];

    const typeData = [
      {
        name: 'Job Fair',
        published: events.filter(
          e => e.type === 'Job Fair' && e.status === 'published'
        ).length,
        ongoing: events.filter(
          e => e.type === 'Job Fair' && e.status === 'ongoing'
        ).length,
        total: events.filter(e => e.type === 'Job Fair').length,
      },
      {
        name: 'Tech',
        published: events.filter(
          e => e.type === 'Tech' && e.status === 'published'
        ).length,
        ongoing: events.filter(e => e.type === 'Tech' && e.status === 'ongoing')
          .length,
        total: events.filter(e => e.type === 'Tech').length,
      },
      {
        name: 'Fun',
        published: events.filter(
          e => e.type === 'Fun' && e.status === 'published'
        ).length,
        ongoing: events.filter(e => e.type === 'Fun' && e.status === 'ongoing')
          .length,
        total: events.filter(e => e.type === 'Fun').length,
      },
    ];

    const timelineData = events
      .reduce((acc, event) => {
        const date = new Date(event.start_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.events += 1;
          if (event.status === 'ongoing') existing.ongoing += 1;
          if (event.status === 'published') existing.published += 1;
        } else {
          acc.push({
            date,
            events: 1,
            ongoing: event.status === 'ongoing' ? 1 : 0,
            published: event.status === 'published' ? 1 : 0,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 7);

    return { statusData, typeData, timelineData };
  }, [events]);

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchAllActiveEvents();
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = timeString => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'published':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case 'Job Fair':
        return 'bg-[#901b20] text-white';
      case 'Tech':
        return 'bg-[#203947] text-white';
      case 'Fun':
        return 'bg-[#ad565a] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleViewDetails = event => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setActionSuccess('');
    setActionError('');
  };

  const handleStartEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/test/live/events/${selectedEvent.id}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === selectedEvent.id
              ? { ...event, status: 'ongoing' }
              : event
          )
        );
        setSelectedEvent(prev => ({ ...prev, status: 'ongoing' }));
        setActionSuccess('Event started successfully! 🎉');
      } else {
        setActionError(data.message || 'Failed to start event');
      }
    } catch (error) {
      console.error('Error starting event:', error);
      setActionError('Network error occurred while starting the event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/test/live/events/${selectedEvent.id}/end`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setEvents(prevEvents =>
          prevEvents.filter(event => event.id !== selectedEvent.id)
        );
        setActionSuccess(
          'Event ended successfully! The event has been completed.'
        );

        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } else {
        setActionError(data.message || 'Failed to end event');
      }
    } catch (error) {
      console.error('Error ending event:', error);
      setActionError('Network error occurred while ending the event');
    } finally {
      setActionLoading(false);
    }
  };

  const canStartEvent = event => {
    return event.status === 'published';
  };

  const canEndEvent = event => {
    return event.status === 'ongoing';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6 shimmer-effect"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 space-y-4 shimmer-effect"
                >
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl animate-shake">
          <div className="text-error mb-6 animate-bounce">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Events
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="button bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-primary bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent mb-2">
                Live Event Monitor
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                Monitor and manage all active events in real-time
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2 sm:gap-3">
                {loading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                <span className="text-sm sm:text-base">
                  {loading ? 'Loading...' : 'Refresh'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards - More Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                Total Active
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary animate-pulse">
                {events.length}
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                Ongoing
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-600 animate-pulse">
                {filteredEvents.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                Job Fairs
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#901b20]">
                {filteredEvents.filter(e => e.type === 'Job Fair').length}
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#203947]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    T
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">
                Tech Events
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#203947]">
                {filteredEvents.filter(e => e.type === 'Tech').length}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 text-base sm:text-lg font-medium placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative group">
                <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
                <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-[#901b20] transition-colors duration-300 pointer-events-none z-10" />
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="appearance-none pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-gray-50 focus:bg-white text-base sm:text-lg font-medium cursor-pointer hover:border-[#901b20]/50 min-w-[140px] sm:min-w-[160px]"
                  style={{
                    backgroundImage: 'none',
                  }}
                >
                  <option
                    value="all"
                    className="py-2 px-4 hover:bg-[#901b20]/10"
                  >
                    All Types
                  </option>
                  <option
                    value="Job Fair"
                    className="py-2 px-4 hover:bg-[#901b20]/10"
                  >
                    Job Fair
                  </option>
                  <option
                    value="Tech"
                    className="py-2 px-4 hover:bg-[#901b20]/10"
                  >
                    Tech
                  </option>
                  <option
                    value="Fun"
                    className="py-2 px-4 hover:bg-[#901b20]/10"
                  >
                    Fun
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Events Grid */}
        {paginatedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center shadow-xl animate-fade-in mb-12 sm:mb-16">
            <div className="text-gray-300 mb-6 sm:mb-8 animate-float">
              <Calendar className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {events.length === 0
                ? 'No Active Events Found'
                : 'No Events Match Your Filters'}
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {events.length === 0
                ? 'There are no published or ongoing events at the moment.'
                : searchTerm || selectedType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No events found.'}
            </p>
            {events.length === 0 && (
              <button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-8 py-3 sm:px-10 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Refresh Events
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {paginatedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden animate-slide-in-left flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced Event Banner */}
                  <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] relative overflow-hidden">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image || '/placeholder.svg'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                      </div>
                    )}

                    {/* Enhanced Status Badge */}
                    <div className="absolute top-3 sm:top-6 right-3 sm:right-6">
                      <span
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold border-2 backdrop-blur-sm ${getStatusColor(event.status)} shadow-lg`}
                      >
                        {event.status === 'ongoing' && (
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse inline-block"></div>
                        )}
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>

                    {/* Enhanced Event Type Badge */}
                    <div className="absolute top-3 sm:top-6 left-3 sm:left-6">
                      <span
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg ${getTypeColor(event.type)}`}
                      >
                        {event.type}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-[#203947] mb-3 sm:mb-4 line-clamp-2 group-hover:text-[#901b20] transition-colors duration-300 h-12 sm:h-14 flex items-start">
                      {event.title}
                    </h3>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#901b20]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#901b20]" />
                        </div>
                        <span className="font-medium truncate text-sm sm:text-base">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#203947]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#203947]" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {formatDate(event.start_date)}
                          {event.start_date !== event.end_date &&
                            ` - ${formatDate(event.end_date)}`}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ad565a]/10 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#ad565a]" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {formatTime(event.start_time)} -{' '}
                          {formatTime(event.end_time)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 mt-auto">
                      <div className="text-xs sm:text-sm text-gray-500 font-medium">
                        Created by {event.creator.first_name}{' '}
                        {event.creator.last_name}
                      </div>

                      <button
                        onClick={() => handleViewDetails(event)}
                        className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="relative">View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Responsive Pagination */}
            {totalFilteredPages > 1 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm sm:text-lg text-gray-600 font-medium text-center sm:text-left">
                    Showing{' '}
                    <span className="font-bold text-[#901b20]">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-bold text-[#901b20]">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredEvents.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-bold text-[#901b20]">
                      {filteredEvents.length}
                    </span>{' '}
                    events
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                      {[...Array(Math.min(3, totalFilteredPages))].map(
                        (_, i) => {
                          let pageNum;
                          if (totalFilteredPages <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage <= 2) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalFilteredPages - 1) {
                            pageNum = totalFilteredPages - 2 + i;
                          } else {
                            pageNum = currentPage - 1 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-bold transition-all duration-300 ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white shadow-lg transform scale-110'
                                  : 'border-2 border-gray-200 hover:border-[#901b20] hover:bg-[#901b20] hover:text-white'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(prev =>
                          Math.min(prev + 1, totalFilteredPages)
                        )
                      }
                      disabled={currentPage === totalFilteredPages}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-[#901b20] hover:bg-[#901b20] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all duration-300 font-medium"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Analytics Section */}
        <div className="space-y-8 sm:space-y-12 animate-fade-in">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-primary bg-gradient-to-r from-[#901b20] to-[#ad565a] bg-clip-text text-transparent mb-3 sm:mb-4">
              Live Events Analytics
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              Real-time insights and statistics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Event Status Distribution */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#901b20] to-[#ad565a] rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="hidden sm:inline">
                    Event Status Distribution
                  </span>
                  <span className="sm:hidden">Status</span>
                </h3>
              </div>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #901b20',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event Types Breakdown */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#203947] to-[#ad565a] rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="hidden sm:inline">
                    Event Types Breakdown
                  </span>
                  <span className="sm:hidden">Types</span>
                </h3>
              </div>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #901b20',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="published"
                      fill="#3b82f6"
                      name="Published"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="ongoing"
                      fill="#10b981"
                      name="Ongoing"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl max-h-[98vh] sm:max-h-[95vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              {/* Enhanced Header */}
              <div className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#cc9598] p-4 sm:p-10 text-white overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-black/10"></div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="relative max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <span
                      className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-bold shadow-lg ${getTypeColor(selectedEvent.type)}`}
                    >
                      {selectedEvent.type}
                    </span>
                    <span className="px-3 py-2 sm:px-6 sm:py-3 bg-white/20 rounded-full text-sm sm:text-lg font-bold flex items-center gap-2 sm:gap-3 backdrop-blur-sm">
                      {selectedEvent.status === 'ongoing' && (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                      )}
                      {selectedEvent.status.charAt(0).toUpperCase() +
                        selectedEvent.status.slice(1)}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-5xl font-black mb-2 sm:mb-3 leading-tight">
                    {selectedEvent.title}
                  </h1>
                  <p className="text-white/90 text-lg sm:text-xl font-medium">
                    Event ID: #{selectedEvent.id}
                  </p>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 sm:p-10">
                  {/* Action Status Messages */}
                  {(actionSuccess || actionError) && (
                    <div className="mb-6 sm:mb-8 animate-slide-in-left">
                      {actionSuccess && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                          <span className="text-green-800 font-bold text-base sm:text-lg">
                            {actionSuccess}
                          </span>
                        </div>
                      )}
                      {actionError && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 animate-shake">
                          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                          <span className="text-red-800 font-bold text-base sm:text-lg">
                            {actionError}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
                    <div className="text-center p-4 sm:p-8 bg-gradient-to-br from-[#901b20]/5 to-[#901b20]/10 rounded-2xl sm:rounded-3xl hover:shadow-lg transition-all duration-300">
                      <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-[#901b20] mx-auto mb-2 sm:mb-4" />
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-lg">
                        Location
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-base">
                        {selectedEvent.location}
                      </p>
                    </div>

                    <div className="text-center p-4 sm:p-8 bg-gradient-to-br from-[#203947]/5 to-[#203947]/10 rounded-2xl sm:rounded-3xl hover:shadow-lg transition-all duration-300">
                      <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-[#203947] mx-auto mb-2 sm:mb-4" />
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-lg">
                        Date
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-base">
                        {formatDate(selectedEvent.start_date)}
                        {selectedEvent.start_date !==
                          selectedEvent.end_date && (
                          <span className="block">
                            to {formatDate(selectedEvent.end_date)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-center p-4 sm:p-8 bg-gradient-to-br from-[#ad565a]/5 to-[#ad565a]/10 rounded-2xl sm:rounded-3xl hover:shadow-lg transition-all duration-300">
                      <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-[#ad565a] mx-auto mb-2 sm:mb-4" />
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-lg">
                        Time
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-base">
                        {formatTime(selectedEvent.start_time)} -{' '}
                        {formatTime(selectedEvent.end_time)}
                      </p>
                    </div>

                    <div className="text-center p-4 sm:p-8 bg-gradient-to-br from-[#cc9598]/5 to-[#cc9598]/10 rounded-2xl sm:rounded-3xl hover:shadow-lg transition-all duration-300">
                      <User className="w-8 h-8 sm:w-12 sm:h-12 text-[#cc9598] mx-auto mb-2 sm:mb-4" />
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-lg">
                        Created By
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-base">
                        {selectedEvent.creator.first_name}{' '}
                        {selectedEvent.creator.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Description */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                        About This Event
                      </h2>
                      <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                          {selectedEvent.description}
                        </p>
                      </div>

                      {/* Interactive Features */}
                      {(selectedEvent.slido_qr_code ||
                        selectedEvent.slido_embed_url) && (
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Interactive Features
                          </h3>
                          <div className="space-y-4 sm:space-y-6">
                            {selectedEvent.slido_qr_code && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-blue-50 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300 gap-4">
                                <div className="flex items-center gap-4 sm:gap-6">
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                                      QR Code Access
                                    </h4>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                                      Scan to join interactive session
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    window.open(
                                      selectedEvent.slido_qr_code,
                                      '_blank'
                                    )
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                                >
                                  View QR
                                </button>
                              </div>
                            )}

                            {selectedEvent.slido_embed_url && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all duration-300 gap-4">
                                <div className="flex items-center gap-4 sm:gap-6">
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                                      Slido Integration
                                    </h4>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                                      Join live Q&A and polls
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    window.open(
                                      selectedEvent.slido_embed_url,
                                      '_blank'
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                                >
                                  Open Slido
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-6 sm:space-y-8">
                      {/* Event Settings */}
                      <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                          Event Settings
                        </h3>
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                              Visibility
                            </label>
                            <p className="text-gray-900 font-semibold text-base sm:text-lg capitalize">
                              {selectedEvent.visibility_type.replace('_', ' ')}
                            </p>
                          </div>

                          {selectedEvent.registration_deadline && (
                            <div>
                              <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Registration Deadline
                              </label>
                              <p className="text-gray-900 font-semibold text-base sm:text-lg">
                                {new Date(
                                  selectedEvent.registration_deadline
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                          Timeline
                        </h3>
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm sm:text-base">
                                Created
                              </p>
                              <p className="text-gray-600 font-medium text-xs sm:text-base">
                                {new Date(
                                  selectedEvent.created_at
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mt-1 sm:mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm sm:text-base">
                                Last Updated
                              </p>
                              <p className="text-gray-600 font-medium text-xs sm:text-base">
                                {new Date(
                                  selectedEvent.updated_at
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Footer Actions */}
              <div className="border-t-2 border-gray-100 p-4 sm:p-8 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-sm sm:text-lg text-gray-600 font-medium text-center sm:text-left">
                    {canStartEvent(selectedEvent) &&
                      '🚀 Ready to start this event'}
                    {canEndEvent(selectedEvent) &&
                      '⚡ Event is currently running'}
                    {!canStartEvent(selectedEvent) &&
                      !canEndEvent(selectedEvent) &&
                      'ℹ️ No actions available for this event'}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {canStartEvent(selectedEvent) && (
                      <button
                        onClick={handleStartEvent}
                        disabled={actionLoading}
                        className="group relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white px-6 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative flex items-center">
                          {actionLoading ? (
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                          ) : (
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                          )}
                          {actionLoading ? 'Starting...' : 'Start Event'}
                        </div>
                      </button>
                    )}

                    {canEndEvent(selectedEvent) && (
                      <button
                        onClick={handleEndEvent}
                        disabled={actionLoading}
                        className="group relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500 text-white px-6 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative flex items-center">
                          {actionLoading ? (
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                          ) : (
                            <Square className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                          )}
                          {actionLoading ? 'Ending...' : 'End Event'}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEventMonitor;
