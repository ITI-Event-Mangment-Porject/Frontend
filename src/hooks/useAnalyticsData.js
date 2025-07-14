'use client';

import { useState } from 'react';

export const useAnalyticsData = () => {
  const [insights, setInsights] = useState([]);
  const [eventsNeedingInsights, setEventsNeedingInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ADMIN_TOKEN = localStorage.getItem('token');
  const APP_URL = import.meta.env.VITE_API_APP_URL;

  const fetchAllInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${APP_URL}/ai-insights/all`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setInsights(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError(err.message || 'Error loading insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedInsight = async eventId => {
    try {
      const response = await fetch(
        `${APP_URL}/ai-insights/events/${eventId}/detailed`,
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
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch detailed insight');
      }
    } catch (err) {
      console.error('Error fetching detailed insight:', err);
      throw new Error(err.message || 'Error loading detailed insight');
    }
  };

  const generateInsight = async eventId => {
    try {
      const response = await fetch(
        `${APP_URL}/ai-insights/events/${eventId}/generate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ regenerate: true }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchAllInsights();
      } else {
        throw new Error(data.message || 'Failed to generate insight');
      }
    } catch (err) {
      console.error('Error generating insight:', err);
      throw new Error(err.message || 'Error generating insight');
    }
  };

  const fetchEventsNeedingInsights = async () => {
    try {
      const response = await fetch(
        `${APP_URL}/ai-insights/events-needing-insights`,
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
        setEventsNeedingInsights(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching events needing insights:', err);
    }
  };

  const autoGenerateAllInsights = async () => {
    try {
      const response = await fetch(
        `${APP_URL}/ai-insights/auto-generate-all`,
        {
          method: 'POST',
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
        await fetchAllInsights();
        await fetchEventsNeedingInsights();
      } else {
        throw new Error(data.message || 'Failed to auto-generate insights');
      }
    } catch (err) {
      console.error('Error auto-generating insights:', err);
      throw new Error(err.message || 'Error auto-generating insights');
    }
  };

  return {
    insights,
    eventsNeedingInsights,
    loading,
    error,
    fetchAllInsights,
    fetchEventsNeedingInsights,
    generateInsight,
    autoGenerateAllInsights,
    fetchDetailedInsight,
  };
};
