'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Activity,
  CheckCircle,
  UserCheck,
  TicketIcon as Queue,
} from 'lucide-react';

// Mock data
const mockLiveEvents = [
  {
    id: 1,
    title: 'Tech Career Fair 2024',
    type: 'Job Fair',
    status: 'ongoing',
    startTime: '09:00',
    endTime: '17:00',
    currentTime: '14:30',
    totalRegistered: 245,
    checkedIn: 189,
    location: 'Main Hall',
    companies: 12,
    activeInterviews: 8,
    queueLength: 23,
  },
  {
    id: 2,
    title: 'AI & Machine Learning Workshop',
    type: 'Tech',
    status: 'ongoing',
    startTime: '10:00',
    endTime: '16:00',
    currentTime: '14:30',
    totalRegistered: 85,
    checkedIn: 72,
    location: 'Lab 1',
    currentSession: 'Deep Learning Fundamentals',
    sessionProgress: 65,
  },
];

export default function LiveEventMonitor() {
  const [setLiveEvents] = useState(mockLiveEvents);
  const [realTimeData, setRealTimeData] = useState({
    totalActive: 2,
    totalAttendees: 261,
    activeInterviews: 11,
    completedToday: 41,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random updates to attendance
      setLiveEvents(prev =>
        prev.map(event => ({
          ...event,
          checkedIn: Math.min(
            event.totalRegistered,
            event.checkedIn + Math.floor(Math.random() * 3)
          ),
        }))
      );

      // Update real-time stats
      setRealTimeData(prev => ({
        ...prev,
        totalAttendees: prev.totalAttendees + Math.floor(Math.random() * 2),
        activeInterviews: Math.max(
          0,
          prev.activeInterviews + (Math.random() > 0.5 ? 1 : -1)
        ),
        completedToday: prev.completedToday + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Live Event Monitor
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {realTimeData.totalActive}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Attendees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {realTimeData.totalAttendees}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Interviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {realTimeData.activeInterviews}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {realTimeData.completedToday}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
