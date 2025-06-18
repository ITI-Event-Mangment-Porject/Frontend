'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Search,
  BarChart3,
  PieChartIcon,
  RefreshCcw,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { EventCard } from './event-card';
import { EventDetailPanel } from '@/components/live-event/event-detail-panal';
import { useEventData } from '@/hooks/use-event-data';
import { Skeleton } from '@/components/ui/skeleton';

const EVENTS_PER_PAGE = 6;

export default function LiveEventMonitor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { events, loading, error, stats, refreshData } = useEventData();

  // Filter events based on search query, type filter, and status filter
  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = filterType === 'all' || event.type === filterType;

    // Status filter
    const matchesStatus =
      filterStatus === 'all' || event.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Handle search change
  const handleSearchChange = value => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle type filter change
  const handleTypeFilterChange = value => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = value => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refreshData();
  };

  // Handle page change
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={e => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={e => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={e => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={e => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-accent-neutral via-white to-accent-medium/10 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-800">
              Live Event Monitor
            </h1>
            <p className="text-secondary-600">
              Track and manage ongoing events in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-primary"></div>
              <span>Live Updates</span>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 border-primary/20 hover:bg-primary/5"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    Active Events
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      {stats.activeEvents}
                    </p>
                  )}
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/10 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    Total Attendees
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-secondary">
                      {stats.totalAttendees}
                    </p>
                  )}
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent-light/20 bg-gradient-to-br from-accent-light/5 to-accent-light/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    Active Interviews
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-accent-light">
                      {stats.activeInterviews}
                    </p>
                  )}
                </div>
                <UserCheck className="h-8 w-8 text-accent-light" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent-medium/20 bg-gradient-to-br from-accent-medium/5 to-accent-medium/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    Completed Today
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-accent-medium">
                      {stats.completedInterviews}
                    </p>
                  )}
                </div>
                <CheckCircle className="h-8 w-8 text-accent-medium" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <Input
              placeholder="Search events..."
              className="pl-9 border-secondary/20 focus:border-primary focus:ring-primary/20"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={handleTypeFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] border-secondary/20 focus:border-primary focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-secondary-500" />
                <SelectValue placeholder="Filter by type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Job Fair">Job Fair</SelectItem>
              <SelectItem value="Tech">Tech Event</SelectItem>
              <SelectItem value="Fun">Fun Event</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] border-secondary/20 focus:border-primary focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-secondary-500" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(filterType !== 'all' || filterStatus !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-600">
                Active filters:
              </span>
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filterType !== 'all' && (
                <Badge
                  variant="secondary"
                  className="bg-secondary/10 text-secondary border-secondary/20"
                >
                  Type: {filterType}
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge
                  variant="secondary"
                  className="bg-accent-light/10 text-accent-light border-accent-light/20"
                >
                  Status: {filterStatus}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-secondary-500 hover:text-secondary-700"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setCurrentPage(1);
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center justify-between text-sm text-secondary-600 bg-white/50 p-3 rounded-lg border border-secondary/10">
            <span>
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredEvents.length)} of{' '}
              {filteredEvents.length} events
            </span>
            {filteredEvents.length > EVENTS_PER_PAGE && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>Failed to load event data. Please try refreshing.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500 text-lg">
              No events found matching your criteria
            </p>
            <p className="text-secondary-400 text-sm mt-2">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterStatus('all');
                setCurrentPage(1);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {!loading && paginatedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
                isSelected={selectedEvent?.id === event.id}
              />
            ))}
          </div>
        )}

        {!loading && filteredEvents.length > EVENTS_PER_PAGE && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>
                {generatePaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {selectedEvent && (
          <EventDetailPanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {!loading && filteredEvents.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-secondary-800">
                Event Analytics
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-primary/20 text-primary"
                >
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-primary"></div>
                  Live Data
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary-800">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Attendance Trends
                  </CardTitle>
                  <CardDescription>
                    Check-ins over time for today's events
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
                      <XAxis dataKey="time" stroke="#203947" />
                      <YAxis stroke="#203947" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #901b20',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="checkedIn"
                        stroke="#901b20"
                        strokeWidth={3}
                        name="Check-ins"
                        dot={{ fill: '#901b20', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#901b20' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary-800">
                    <PieChartIcon className="h-5 w-5 text-secondary" />
                    Interview Queue Status
                  </CardTitle>
                  <CardDescription>
                    Current interview queue distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.queueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
                      <XAxis dataKey="company" stroke="#203947" />
                      <YAxis stroke="#203947" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #203947',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="waiting" name="Waiting" fill="#ad565a" />
                      <Bar
                        dataKey="inProgress"
                        name="In Progress"
                        fill="#203947"
                      />
                      <Bar
                        dataKey="completed"
                        name="Completed"
                        fill="#cc9598"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
