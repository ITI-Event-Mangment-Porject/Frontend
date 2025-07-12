'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Users,
  Scan,
  Loader2,
  Activity,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function QRCheckInScanner({ events = [] }) {
  const [qrToken, setQrToken] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [eventId, setEventId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState([]);

  const handleCheckIn = async token => {
    if (!token.trim()) return;

    try {
      setError(null);
      setIsProcessing(true);

      // Get auth token from localStorage
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/events/${eventId}/check-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({ token: token.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const successResult = {
          success: true,
          message: data.message || 'Check-in successful!',
          data: data.data,
          timestamp: new Date().toLocaleString(),
        };

        setLastResult(successResult);
        setCheckedInCount(prev => prev + 1);

        // Add to recent check-ins
        setRecentCheckIns(prev => [
          {
            id: data.data?.id || Date.now(),
            userName: data.data?.user_name || 'Unknown',
            timestamp: new Date().toLocaleString(),
            status: 'success',
          },
          ...prev.slice(0, 4), // Keep only last 5
        ]);

        // Clear the input for next scan
        setQrToken('');

        // Clear result after 3 seconds
        setTimeout(() => {
          setLastResult(null);
        }, 3000);
      } else {
        const errorResult = {
          success: false,
          message: data.message || 'Check-in failed',
          timestamp: new Date().toLocaleString(),
        };

        setLastResult(errorResult);

        // Add to recent check-ins as failed
        setRecentCheckIns(prev => [
          {
            id: Date.now(),
            userName: 'Failed',
            timestamp: new Date().toLocaleString(),
            status: 'error',
            error: data.message,
          },
          ...prev.slice(0, 4),
        ]);

        // Clear result after 4 seconds
        setTimeout(() => {
          setLastResult(null);
        }, 4000);
      }
    } catch (err) {
      console.error('Check-in error:', err);
      setError('Network error. Please check your connection and try again.');

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle input change - process when token is entered
  const handleTokenChange = e => {
    const value = e.target.value;
    setQrToken(value);

    // Auto-process when a complete token is scanned (assuming tokens have a minimum length)
    if (value.length >= 10 && !isProcessing) {
      handleCheckIn(value);
    }
  };

  // Handle manual submit
  const handleManualSubmit = e => {
    e.preventDefault();
    if (qrToken.trim() && !isProcessing) {
      handleCheckIn(qrToken);
    }
  };

  // Clear all alerts
  const clearAlerts = () => {
    setError(null);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#901b20] via-[#ad565a] to-[#cc9598] bg-clip-text text-transparent mb-4">
            Student Check-In Scanner
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Scan student QR codes to check them into the event with real-time
            processing
          </p>
        </div>

        {/* Enhanced Stats Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="bg-gradient-to-r from-[#901b20] via-[#ad565a] to-[#cc9598] p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-white/90 text-lg font-semibold uppercase tracking-wider mb-2">
                    Students Checked In
                  </p>
                  <p className="text-5xl font-black text-white">
                    {checkedInCount}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[300px]">
                <p className="text-white/90 text-lg font-semibold mb-4">
                  Select Event
                </p>
                <Select
                  value={eventId}
                  onValueChange={setEventId}
                  disabled={events.length === 0}
                >
                  <SelectTrigger className="w-full bg-white/20 border-white/30 text-white text-lg font-semibold backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.length > 0 ? (
                      events.map(event => (
                        <SelectItem key={event.id} value={String(event.id)}>
                          {event.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-events" disabled>
                        No ongoing events
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scanner Input Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
          <div className="bg-gradient-to-r from-[#203947] via-[#901b20] to-[#ad565a] p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  QR Code Scanner
                </h2>
                <p className="text-white/90 text-lg font-medium">
                  Scan QR code or enter token manually for instant check-in
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* QR Token Input */}
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="qr-token"
                  className="block text-lg font-bold text-gray-700 mb-4"
                >
                  QR Token
                </label>
                <div className="relative">
                  <Input
                    id="qr-token"
                    type="text"
                    value={qrToken}
                    onChange={handleTokenChange}
                    placeholder="Scan QR code or enter token..."
                    className="text-xl p-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#901b20]/20 focus:border-[#901b20] transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                    disabled={isProcessing}
                    autoFocus
                  />
                  {isProcessing && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-6 h-6 text-[#901b20] animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={!qrToken.trim() || isProcessing}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a1619] hover:to-[#8a4548] disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    <span>
                      {isProcessing ? 'Processing...' : 'Check In Student'}
                    </span>
                  </div>
                </Button>

                <Button
                  type="button"
                  onClick={() => setQrToken('')}
                  variant="outline"
                  className="px-8 py-4 text-lg font-bold rounded-2xl border-2 border-gray-200 hover:border-[#901b20] hover:bg-[#901b20] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Clear Input
                </Button>
              </div>
            </form>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 rounded-2xl p-8 border-2 border-[#901b20]/20 animate-pulse">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-[#901b20]/20 rounded-full animate-spin border-t-[#901b20]"></div>
                  </div>
                  <div>
                    <p className="text-[#901b20] font-bold text-xl">
                      Processing check-in...
                    </p>
                    <p className="text-gray-600 font-medium">
                      Please wait while we verify the QR code
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Error Alert */}
            {error && (
              <Alert className="border-2 border-red-200 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 p-6 animate-shake">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-800 font-bold text-lg mb-2">
                      Check-in Failed
                    </h3>
                    <AlertDescription className="text-red-700 font-medium text-base">
                      {error}
                    </AlertDescription>
                  </div>
                  <Button
                    onClick={clearAlerts}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-200 rounded-xl p-2"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </Alert>
            )}

            {/* Enhanced Success/Error Result */}
            {lastResult && (
              <Alert
                className={`border-2 rounded-2xl p-6 ${
                  lastResult.success
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-green-100 animate-bounce-in'
                    : 'border-red-200 bg-gradient-to-r from-red-50 to-red-100 animate-shake'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      lastResult.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {lastResult.success ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <XCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg mb-2 ${lastResult.success ? 'text-green-800' : 'text-red-800'}`}
                    >
                      {lastResult.success
                        ? '🎉 Check-in Successful!'
                        : '❌ Check-in Failed'}
                    </h3>
                    <AlertDescription
                      className={`font-medium text-base mb-3 ${lastResult.success ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {lastResult.message}
                    </AlertDescription>
                    {lastResult.data && (
                      <div
                        className={`p-4 rounded-xl ${lastResult.success ? 'bg-green-200/50' : 'bg-red-200/50'}`}
                      >
                        <p className="font-bold text-gray-800 mb-1">
                          Student: {lastResult.data.user_name}
                        </p>
                        <p className="text-gray-600 font-medium">
                          Checked in at: {lastResult.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={clearAlerts}
                    variant="ghost"
                    size="sm"
                    className={`rounded-xl p-2 ${
                      lastResult.success
                        ? 'text-green-600 hover:text-green-800 hover:bg-green-200'
                        : 'text-red-600 hover:text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </Alert>
            )}
          </div>
        </div>

        {/* Enhanced Recent Check-ins */}
        {recentCheckIns.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="bg-gradient-to-r from-[#203947] to-[#ad565a] p-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Recent Check-ins
                  </h2>
                  <p className="text-white/90 text-lg font-medium">
                    Latest student check-in activity
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                {recentCheckIns.map((checkIn, index) => (
                  <div
                    key={checkIn.id}
                    className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                      checkIn.status === 'success'
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:border-green-300'
                        : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:border-red-300'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          checkIn.status === 'success'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {checkIn.status === 'success' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-1">
                          {checkIn.userName}
                        </p>
                        {checkIn.error && (
                          <p className="text-red-600 font-medium text-sm">
                            {checkIn.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>{checkIn.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
