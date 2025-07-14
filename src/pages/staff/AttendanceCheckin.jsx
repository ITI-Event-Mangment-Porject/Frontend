import { useState, useEffect } from 'react';
import QRCheckInScanner from '@/components/staff/QRCheckInScanner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import Layout from '@/components/common/Layout';
import useScrollToTop from '../../hooks/useScrollToTop';

const APP_URL = import.meta.env.VITE_API_BASE_URL;

const AttendanceCheckin = () => {
  useScrollToTop();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const authToken = localStorage.getItem('token');
        if (!authToken) {
          setError('Authentication token not found. Please log in again.');
          return;
        }

        const response = await fetch(
          `${APP_URL}/api/events?filter[status]=ongoing`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setEvents(data.data.result.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert
          variant="destructive"
          className="bg-red-100 border-red-500 text-red-800"
        >
          <XCircle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-bold">Error loading events:</p>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mt-1 bg-white shadow-lg duration-300 ease-in-out border-r border-gray-200 rounded-lg overflow-hidden">
        <QRCheckInScanner events={events} />
      </div>
    </Layout>
  );
};

export default AttendanceCheckin;
