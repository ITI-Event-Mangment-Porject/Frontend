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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LiveEventMonitor = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/events?page=${currentPage}`
        );
        const data = await response.json();

        if (data.success) {
          const activeEvents = data.data.result.data.filter(
            event => event.status === 'published' || event.status === 'ongoing'
          );
          setEvents(activeEvents);
          setTotalPages(data.data.result.last_page);
          setTotalEvents(activeEvents.length);
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        setError('Error loading events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage]);

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

  const itemsPerPage = 6;
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const totalFilteredPages = Math.ceil(filteredEvents.length / itemsPerPage);

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
  };

  const handleStartEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/test/live/events/${selectedEvent.id}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the event status in the local state
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === selectedEvent.id
              ? { ...event, status: 'ongoing' }
              : event
          )
        );
        setSelectedEvent(prev => ({ ...prev, status: 'ongoing' }));
        alert('Event started successfully!');
      } else {
        alert('Failed to start event');
      }
    } catch (error) {
      console.error('Error starting event:', error);
      alert('Error starting event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndEvent = async () => {
    if (!selectedEvent) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/test/live/events/${selectedEvent.id}/end`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove the event from active events since it's now completed
        setEvents(prevEvents =>
          prevEvents.filter(event => event.id !== selectedEvent.id)
        );
        setIsModalOpen(false);
        alert('Event ended successfully!');
      } else {
        alert('Failed to end event');
      }
    } catch (error) {
      console.error('Error ending event:', error);
      alert('Error ending event');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] p-6">
        <p>Total Pages: {totalPages}</p>
        <p>Total Events: {totalEvents}</p>

        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
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
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Events
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#901b20] hover:bg-[#7a1619]"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#203947] mb-2">
            Live Event Monitor
          </h1>
          <p className="text-gray-600">
            Monitor and track all active events in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Active Events</p>
                  <p className="text-2xl font-bold text-[#203947]">
                    {filteredEvents.length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-[#901b20]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing Events</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredEvents.filter(e => e.status === 'ongoing').length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Job Fairs</p>
                  <p className="text-2xl font-bold text-[#901b20]">
                    {filteredEvents.filter(e => e.type === 'Job Fair').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[#901b20]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tech Events</p>
                  <p className="text-2xl font-bold text-[#203947]">
                    {filteredEvents.filter(e => e.type === 'Tech').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[#203947] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Job Fair">Job Fair</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Fun">Fun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {paginatedEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Events Found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'There are no active events at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedEvents.map(event => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  {/* Event Banner */}
                  <div className="h-48 bg-gradient-to-r from-[#901b20] to-[#ad565a] relative">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image || '/placeholder.svg'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${getStatusColor(event.status)} border`}
                      >
                        {event.status === 'ongoing' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        )}
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-[#203947] line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p> */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span>
                          {formatDate(event.start_date)}
                          {event.start_date !== event.end_date &&
                            ` - ${formatDate(event.end_date)}`}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-[#901b20]" />
                        <span>
                          {formatTime(event.start_time)} -{' '}
                          {formatTime(event.end_time)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        Created by {event.creator.first_name}{' '}
                        {event.creator.last_name}
                      </div>

                      <Button
                        size="sm"
                        className="bg-[#901b20] hover:bg-[#7a1619] text-white"
                        onClick={() => handleViewDetails(event)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredEvents.length
                      )}{' '}
                      of {filteredEvents.length} events
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(prev => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(5, totalFilteredPages))].map(
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={
                                  currentPage === pageNum
                                    ? 'bg-[#901b20] hover:bg-[#7a1619]'
                                    : ''
                                }
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(prev =>
                            Math.min(prev + 1, totalFilteredPages)
                          )
                        }
                        disabled={currentPage === totalFilteredPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Event Details Overlay */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#901b20] to-[#ad565a] p-8 text-white">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(selectedEvent.type)}`}
                    >
                      {selectedEvent.type}
                    </span>
                    <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium flex items-center gap-2">
                      {selectedEvent.status === 'ongoing' && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                      {selectedEvent.status.charAt(0).toUpperCase() +
                        selectedEvent.status.slice(1)}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">
                    {selectedEvent.title}
                  </h1>
                  <p className="text-white/80 text-lg">
                    Event ID: #{selectedEvent.id}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
                <div className="p-8">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <MapPin className="w-8 h-8 text-[#901b20] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Location
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedEvent.location}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <Calendar className="w-8 h-8 text-[#203947] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
                      <p className="text-gray-600 text-sm">
                        {formatDate(selectedEvent.start_date)}
                        {selectedEvent.start_date !==
                          selectedEvent.end_date && (
                          <span className="block">
                            to {formatDate(selectedEvent.end_date)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <Clock className="w-8 h-8 text-[#ad565a] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
                      <p className="text-gray-600 text-sm">
                        {formatTime(selectedEvent.start_time)} -{' '}
                        {formatTime(selectedEvent.end_time)}
                      </p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <User className="w-8 h-8 text-[#cc9598] mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Created By
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {selectedEvent.creator.first_name}{' '}
                        {selectedEvent.creator.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        About This Event
                      </h2>
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedEvent.description}
                        </p>
                      </div>

                      {/* Interactive Features */}
                      {(selectedEvent.slido_qr_code ||
                        selectedEvent.slido_embed_url) && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Interactive Features
                          </h3>
                          <div className="space-y-4">
                            {selectedEvent.slido_qr_code && (
                              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <QrCode className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      QR Code Access
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Scan to join interactive session
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() =>
                                    window.open(
                                      selectedEvent.slido_qr_code,
                                      '_blank'
                                    )
                                  }
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  View QR
                                </Button>
                              </div>
                            )}

                            {selectedEvent.slido_embed_url && (
                              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                    <ExternalLink className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      Slido Integration
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Join live Q&A and polls
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() =>
                                    window.open(
                                      selectedEvent.slido_embed_url,
                                      '_blank'
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Open Slido
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Event Settings */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Event Settings
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Visibility
                            </label>
                            <p className="text-gray-900 capitalize">
                              {selectedEvent.visibility_type.replace('_', ' ')}
                            </p>
                          </div>

                          {selectedEvent.registration_deadline && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Registration Deadline
                              </label>
                              <p className="text-gray-900">
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

                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Event Slug
                            </label>
                            <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {selectedEvent.slug}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Timeline
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Created
                              </p>
                              <p className="text-sm text-gray-600">
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

                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Last Updated
                              </p>
                              <p className="text-sm text-gray-600">
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

              {/* Footer Actions */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Manage your event with the controls on the right
                  </div>

                  <div className="flex gap-3">
                    {selectedEvent.status === 'published' && (
                      <Button
                        onClick={handleStartEvent}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium"
                      >
                        {actionLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Play className="w-5 h-5 mr-2" />
                        )}
                        Start Event
                      </Button>
                    )}

                    {selectedEvent.status === 'ongoing' && (
                      <Button
                        onClick={handleEndEvent}
                        disabled={actionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-medium"
                      >
                        {actionLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Square className="w-5 h-5 mr-2" />
                        )}
                        End Event
                      </Button>
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
