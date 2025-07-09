import { useState, useEffect } from 'react';
import { userAPI, trackAPI } from '../services/api';
import useApi from './useApi';

export const useUserManagement = () => {
  // State
  const [users, setUsers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  // API hooks
  const { loading, error, execute: fetchUsers } = useApi();
  const { loading: submitLoading, execute: submitUser } = useApi();
  const { loading: trackLoading, execute: fetchTracks } = useApi();

  // Data loading functions
  const loadUsers = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        search: searchTerm || undefined,
        track_id: selectedTrack || undefined,
      };

      const result = await fetchUsers(() => userAPI.getAll(params));
      if (result.success) {
        setUsers(result.data.users);
        setPagination({
          currentPage: result.data.pagination.current_page,
          lastPage: result.data.pagination.last_page,
          perPage: result.data.pagination.per_page,
          total: result.data.pagination.total,
          from: result.data.pagination.from,
          to: result.data.pagination.to,
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadTracks = async () => {
    try {
      const result = await fetchTracks(() => trackAPI.getAll());
      if (result.success) {
        setTracks(result.data.tracks || result.data || []);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      setTracks([]);
    }
  };

  // Effects
  useEffect(() => {
    loadUsers();
    loadTracks();
  }, [selectedTrack, selectedStatus, pagination.currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination handler
  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  return {
    // State
    users,
    tracks,
    searchTerm,
    setSearchTerm,
    selectedTrack,
    setSelectedTrack,
    selectedStatus,
    setSelectedStatus,
    pagination,

    // Loading states
    loading,
    error,
    submitLoading,
    trackLoading,

    // Functions
    loadUsers,
    loadTracks,
    handlePageChange,

    // API functions
    submitUser,
  };
};
