'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  X,
  Clock,
  Users,
  Building2,
  TicketIcon as Queue,
  MapPin,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  UserX,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function EventDetailPanel({ event, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts - replace with real data
  const attendanceData = [
    { time: '09:00', checkedIn: 0 },
    { time: '10:00', checkedIn: Math.floor(event.totalRegistered * 0.2) },
    { time: '11:00', checkedIn: Math.floor(event.totalRegistered * 0.4) },
    { time: '12:00', checkedIn: Math.floor(event.totalRegistered * 0.6) },
    { time: '13:00', checkedIn: Math.floor(event.totalRegistered * 0.8) },
    { time: '14:00', checkedIn: event.checkedIn },
  ];

  const queueData =
    event.type === 'Job Fair'
      ? [
          { name: 'Waiting', value: event.queueLength, color: '#f59e0b' },
          {
            name: 'In Progress',
            value: event.activeInterviews,
            color: '#3b82f6',
          },
          {
            name: 'Completed',
            value: Math.floor(event.queueLength * 1.5),
            color: '#10b981',
          },
          {
            name: 'No Show',
            value: Math.floor(event.queueLength * 0.1),
            color: '#ef4444',
          },
        ]
      : [];

  const sessionData =
    event.type === 'Tech'
      ? [
          { name: 'Session 1', duration: 60, completed: 100 },
          { name: 'Session 2', duration: 45, completed: 100 },
          {
            name: 'Current',
            duration: 90,
            completed: event.sessionProgress || 65,
          },
          { name: 'Session 4', duration: 60, completed: 0 },
          { name: 'Session 5', duration: 30, completed: 0 },
        ]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-primary/20 bg-white shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <Badge variant="outline">{event.type}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
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
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {event.checkedIn} / {event.totalRegistered} Attendees
                </span>
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              {event.type === 'Job Fair' ? (
                <TabsTrigger value="queue">Queue</TabsTrigger>
              ) : (
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        Check-ins
                      </p>
                      <p className="text-2xl font-bold">{event.checkedIn}</p>
                      <p className="text-xs text-gray-500">
                        of {event.totalRegistered} registered
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {event.type === 'Job Fair' ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Queue className="h-8 w-8 text-orange-500 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          Queue Length
                        </p>
                        <p className="text-2xl font-bold">
                          {event.queueLength}
                        </p>
                        <p className="text-xs text-gray-500">
                          across {event.companies} companies
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Clock className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium text-gray-600">
                          Session Progress
                        </p>
                        <p className="text-2xl font-bold">
                          {event.sessionProgress || 0}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.currentSession || 'Current session'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Event Progress</h4>
                <Progress value={event.progress || 50} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{event.startTime}</span>
                  <span>Current</span>
                  <span>{event.endTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Notification
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Report Issue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <UserCheck className="h-6 w-6 text-green-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Checked In
                        </p>
                        <p className="text-xl font-bold">{event.checkedIn}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <UserX className="h-6 w-6 text-red-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          No Shows
                        </p>
                        <p className="text-xl font-bold">
                          {event.totalRegistered - event.checkedIn}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Users className="h-6 w-6 text-blue-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Total
                        </p>
                        <p className="text-xl font-bold">
                          {event.totalRegistered}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <BarChart3 className="h-6 w-6 text-purple-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Check-in Rate
                        </p>
                        <p className="text-xl font-bold">
                          {Math.round(
                            (event.checkedIn / event.totalRegistered) * 100
                          )}
                          %
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Attendance Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="checkedIn"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="queue" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Queue className="h-6 w-6 text-orange-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Waiting
                        </p>
                        <p className="text-xl font-bold">{event.queueLength}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <UserCheck className="h-6 w-6 text-blue-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          In Progress
                        </p>
                        <p className="text-xl font-bold">
                          {event.activeInterviews}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Completed
                        </p>
                        <p className="text-xl font-bold">
                          {Math.floor(event.queueLength * 1.5)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Building2 className="h-6 w-6 text-gray-500 mb-1" />
                        <p className="text-xs font-medium text-gray-600">
                          Companies
                        </p>
                        <p className="text-xl font-bold">{event.companies}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Queue Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={queueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {queueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="pt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Session</CardTitle>
                    <CardDescription>
                      {event.currentSession || 'Session in progress'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{event.sessionProgress || 65}%</span>
                    </div>
                    <Progress
                      value={event.sessionProgress || 65}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Started: 14:00</span>
                      <span>Ends: 15:30</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Session Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>View Full Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
