'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Calendar,
  Building2,
  TicketIcon as Queue,
  MapPin,
  Users,
  Eye,
} from 'lucide-react';

export function EventCard({ event, onClick, isSelected }) {
  const getStatusColor = status => {
    switch (status) {
      case 'ongoing':
        return 'bg-primary text-white';
      case 'upcoming':
        return 'bg-secondary text-white';
      case 'completed':
        return 'bg-accent-light text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEventProgress = event => {
    const start = new Date(`2024-01-01 ${event.startTime}`);
    const end = new Date(`2024-01-01 ${event.endTime}`);
    const current = new Date(
      `2024-01-01 ${event.currentTime || event.startTime}`
    );

    const total = end.getTime() - start.getTime();
    const elapsed = current.getTime() - start.getTime();

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const getEventTypeIcon = type => {
    switch (type) {
      case 'Job Fair':
        return <Building2 className="h-4 w-4" />;
      case 'Tech':
        return <Users className="h-4 w-4" />;
      case 'Fun':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = type => {
    switch (type) {
      case 'Job Fair':
        return 'border-primary/20 text-primary bg-primary/5';
      case 'Tech':
        return 'border-secondary/20 text-secondary bg-secondary/5';
      case 'Fun':
        return 'border-accent-light/20 text-accent-light bg-accent-light/5';
      default:
        return 'border-gray-200 text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 bg-white/80 backdrop-blur-sm ${
        isSelected
          ? 'ring-2 ring-primary shadow-lg border-primary/50'
          : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${getEventTypeColor(event.type)}`}
          >
            {getEventTypeIcon(event.type)}
            {event.type}
          </Badge>
          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
        </div>
        <CardTitle className="text-lg text-secondary-800 line-clamp-2">
          {event.title}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary-600">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary-600">Event Progress</span>
            <span className="font-semibold text-primary">
              {Math.round(getEventProgress(event))}%
            </span>
          </div>
          <Progress
            value={getEventProgress(event)}
            className="h-2 bg-accent-neutral"
          />
        </div>

        {/* Attendance */}
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent-neutral to-accent-medium/10 rounded-lg">
          <span className="text-sm text-secondary-600">Attendance</span>
          <span className="font-semibold text-secondary-800">
            {event.checkedIn} / {event.totalRegistered}
          </span>
        </div>

        {/* Event-specific metrics */}
        {event.type === 'Job Fair' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-secondary-700">
                {event.companies} Companies
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-accent-light/10 rounded-lg">
              <Queue className="h-4 w-4 text-accent-light" />
              <span className="text-sm text-secondary-700">
                {event.queueLength} in Queue
              </span>
            </div>
          </div>
        )}

        {event.type === 'Tech' && event.currentSession && (
          <div className="p-3 bg-secondary/5 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Current Session:</p>
            <p className="font-medium text-secondary-800 text-sm">
              {event.currentSession}
            </p>
            {event.sessionProgress && (
              <Progress
                value={event.sessionProgress}
                className="h-1 mt-2 bg-accent-neutral"
              />
            )}
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-center gap-1 text-primary hover:text-primary/80 transition-colors">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">View Details</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
