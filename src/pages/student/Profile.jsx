import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFileUpload,
  FaTrash,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaBook,
  FaGraduationCap,
  FaCamera,
  FaDownload,
  FaAward,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
import styles from './Profile.module.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [imageError, setImageError] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const showToast = useCallback((message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  const getUserIdFromToken = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id || payload.sub;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      setCurrentUserId(userId);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success && data.data.user) {
        const user = data.data.user;
        const profileData = {
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          program: user.program,
          branch: user.branch,
          bio: user.bio || '',
          avatar: user.profile_image,
          linkedin_url: user.linkedin_url || '',
          github_url: user.github_url || '',
          portfolio_url: user.portfolio_url || '',
          intake_year: user.intake_year,
          graduation_year: user.graduation_year,
          cv_path: user.cv_path,
          intake: user.intake,
          round: user.round,
          is_active: user.is_active,
          last_login_at: user.last_login_at,
        };
        setProfile(profileData);
      }
    } catch (err) {
      setError('Failed to load profile: ' + err.message);
      showToast('Failed to load profile: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getUserIdFromToken, showToast]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');

      const updateData = {
        first_name: editForm.first_name || '',
        last_name: editForm.last_name || '',
        phone: editForm.phone || '',
        bio: editForm.bio || '',
        linkedin_url: editForm.linkedin_url || '',
        github_url: editForm.github_url || '',
        portfolio_url: editForm.portfolio_url || '',
        intake_year: editForm.intake_year
          ? parseInt(editForm.intake_year, 10)
          : null,
        graduation_year: editForm.graduation_year
          ? parseInt(editForm.graduation_year, 10)
          : null,
        profile_img: editForm.profile_img || '',
      };

      // Remove null/empty values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/api/users/${currentUserId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.data.user;
        const updatedProfile = {
          name: `${updatedUser.first_name} ${updatedUser.last_name}`,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          program: updatedUser.program,
          branch: updatedUser.branch,
          bio: updatedUser.bio || '',
          avatar: updatedUser.profile_image,
          linkedin_url: updatedUser.linkedin_url || '',
          github_url: updatedUser.github_url || '',
          portfolio_url: updatedUser.portfolio_url || '',
          intake_year: updatedUser.intake_year,
          graduation_year: updatedUser.graduation_year,
          cv_path: updatedUser.cv_path,
          portal_user_id: updatedUser.portal_user_id,
          intake: updatedUser.intake,
          round: updatedUser.round,
          is_active: updatedUser.is_active,
          last_login_at: updatedUser.last_login_at,
        };

        setProfile(updatedProfile);
        setEditMode(false);
        const successMessage = data.message || 'Profile updated successfully!';
        setSuccess(successMessage);
        showToast(successMessage);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = 'Failed to update profile: ' + err.message;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  }, [API_BASE_URL, currentUserId, editForm, showToast]);

  const handleImageUpload = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        const errorMessage =
          'Please upload a JPEG, PNG, JPG, or WEBP image only';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const errorMessage = 'Image size must be less than 5MB';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('profile_image', file);

        const response = await fetch(
          `${API_BASE_URL}/api/users/${currentUserId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `HTTP error! status: ${response.status}`
          );
        }

        if (data.success) {
          const updatedAvatar = data.data.profile_image || data.data.avatar;
          setProfile(prev => ({ ...prev, avatar: updatedAvatar }));
          setEditForm(prev => ({
            ...prev,
            avatar: updatedAvatar,
            profile_img: updatedAvatar,
          }));
          setImageError(false);

          const successMessage =
            data.message || 'Profile image updated successfully!';
          setSuccess(successMessage);
          showToast(successMessage);
          setTimeout(() => setSuccess(null), 3000);
        } else {
          throw new Error(data.message || 'Failed to upload profile image');
        }
      } catch (err) {
        console.error('Image upload error:', err);
        const errorMessage = 'Failed to upload profile image: ' + err.message;
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setUploading(false);
      }
    },
    [API_BASE_URL, currentUserId, showToast]
  );

  const handleFileUpload = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        const errorMessage = 'Please upload a PDF, DOC, or DOCX file only';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const errorMessage = 'File size must be less than 5MB';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('cv_path', file);

        const response = await fetch(
          `${API_BASE_URL}/api/users/${currentUserId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `HTTP error! status: ${response.status}`
          );
        }

        if (data.success) {
          setProfile(prev => ({ ...prev, cv_path: data.data.cv_path }));

          const newDocument = {
            id: Date.now(),
            name: file.name,
            date: new Date().toISOString().slice(0, 10),
            size: `${Math.round(file.size / 1024)} KB`,
            type: file.type,
            path: data.data.cv_path,
          };

          setDocuments(docs => [...docs, newDocument]);
          const successMessage = data.message || 'CV uploaded successfully!';
          setSuccess(successMessage);
          showToast(successMessage);
          setTimeout(() => setSuccess(null), 3000);
        } else {
          throw new Error(data.message || 'Failed to upload CV');
        }
      } catch (err) {
        console.error('Upload error:', err);
        const errorMessage = 'Failed to upload CV: ' + err.message;
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setUploading(false);
      }
    },
    [API_BASE_URL, currentUserId, showToast]
  );

  const handleDeleteDocument = useCallback(
    async docId => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete CV');
        }

        const data = await response.json();

        if (data.success) {
          setDocuments(docs => docs.filter(doc => doc.id !== docId));
          setProfile(prev => ({ ...prev, cv_path: null }));
          const successMessage = 'CV deleted successfully!';
          setSuccess(successMessage);
          showToast(successMessage);
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        const errorMessage = 'Failed to delete CV: ' + err.message;
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    },
    [API_BASE_URL, currentUserId, showToast]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleEditModeToggle = useCallback(() => {
    if (!editMode) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || '',
        intake_year: profile.intake_year || '',
        graduation_year: profile.graduation_year || '',
        avatar: profile.avatar || '',
        profile_img: profile.avatar || '',
      });
      setEditMode(true);
      setError(null);
    } else {
      setEditForm({});
      setEditMode(false);
      setError(null);
    }
  }, [editMode, profile]);

  const handleFormChange = useCallback((field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <>
        <HomeNavbar />
        <div
          className="min-h-screen p-4 pt-32"
          style={{
            background: `linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 50%, var(--gray-50) 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Profile Section Skeleton */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex flex-col xl:flex-row items-center xl:items-start space-y-8 xl:space-y-0 xl:space-x-12">
                {/* Profile Image Skeleton */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="absolute -top-2 -left-2 w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Profile Info Skeleton */}
                <div className="flex-1 text-center xl:text-left space-y-6">
                  <div>
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4 w-64 mx-auto xl:mx-0"></div>
                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48 mx-auto xl:mx-0"></div>
                  </div>

                  {/* Contact Info Grid Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(item => (
                      <div
                        key={item}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50"
                      >
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social Links Skeleton */}
                  <div className="flex justify-center xl:justify-start space-x-4">
                    {[1, 2, 3].map(item => (
                      <div
                        key={item}
                        className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Action Button Skeleton */}
                <div className="w-36 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
              {/* Personal Information Skeleton */}
              <div className="xl:col-span-2 w-full">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-48"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                      <div key={item} className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                        <div className="w-full h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  {/* Bio Section Skeleton */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                    <div className="w-full h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="w-full space-y-8">
                {/* Social Links Skeleton */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-28"></div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map(item => (
                      <div key={item} className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                        <div className="w-full h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CV Upload Skeleton */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-24"></div>
                    </div>
                    <div className="w-20 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>

                  <div className="w-full h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }

  return (
    <>
      <HomeNavbar />
      <div
        className={`min-h-screen p-4 pt-32 ${styles.profileContainer || 'profile-container'}`}
        style={{
          background: `linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 50%, var(--gray-50) 100%)`,
        }}
      >
        <div
          className={`max-w-7xl mx-auto space-y-6 ${styles.profileGrid || ''}`}
        >
          {/* Toast Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="bg-white/95 backdrop-blur-sm border-l-4 rounded-lg p-4 shadow-lg flex items-center space-x-3"
                style={{ borderLeftColor: 'var(--success-500)' }}
              >
                <FaCheckCircle
                  style={{ color: 'var(--success-500)' }}
                  className="text-xl"
                />
                <p
                  style={{ color: 'var(--success-500)' }}
                  className="font-medium"
                >
                  {success}
                </p>
                <button
                  onClick={() => setSuccess(null)}
                  className="ml-auto p-1 rounded-full hover:bg-green-100 transition-colors"
                >
                  <FaTimes style={{ color: 'var(--success-500)' }} />
                </button>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="bg-white/95 backdrop-blur-sm border-l-4 rounded-lg p-4 shadow-lg flex items-center space-x-3"
                style={{ borderLeftColor: 'var(--error-500)' }}
              >
                <FaExclamationCircle
                  style={{ color: 'var(--error-500)' }}
                  className="text-xl"
                />
                <div className="flex-1">
                  <p
                    style={{ color: 'var(--error-500)' }}
                    className="font-medium"
                  >
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  <FaTimes style={{ color: 'var(--error-500)' }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border"
            style={{ borderColor: 'var(--primary-200)' }}
          >
            <div className="flex flex-col xl:flex-row items-center xl:items-start space-y-8 xl:space-y-0 xl:space-x-12">
              {/* Profile Image Section */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="relative">
                  {(editMode ? editForm.avatar : profile.avatar) &&
                  !imageError ? (
                    <img
                      src={
                        editMode
                          ? `${API_BASE_URL}${editForm.avatar}`
                          : `${API_BASE_URL}${profile.avatar}`
                      }
                      alt="Profile"
                      onError={handleImageError}
                      className="w-40 h-40 rounded-full object-cover shadow-xl border-4"
                      style={{ borderColor: 'var(--primary-500)' }}
                    />
                  ) : (
                    <div
                      className="w-40 h-40 rounded-full shadow-xl border-4 flex items-center justify-center text-6xl font-bold text-white"
                      style={{
                        borderColor: 'var(--primary-500)',
                        backgroundColor: 'var(--primary-500)',
                      }}
                    >
                      {(editMode
                        ? `${editForm.first_name || ''}${editForm.last_name || ''}`
                        : profile.name || 'U'
                      )
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </div>
                  )}

                  {/* Upload Button/Camera Icon */}
                  <motion.label
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300"
                    style={{
                      backgroundColor: uploading
                        ? 'var(--gray-400)'
                        : 'var(--primary-500)',
                    }}
                  >
                    {uploading ? (
                      <FaSpinner className="text-white text-lg animate-spin" />
                    ) : (
                      <FaCamera className="text-white text-lg" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                    />
                  </motion.label>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <FaEdit className="text-white text-2xl mb-1 mx-auto" />
                      <p className="text-white text-xs font-medium">
                        Change Photo
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center xl:text-left space-y-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-2"
                    style={{ color: 'var(--gray-800)' }}
                  >
                    {editMode
                      ? `${editForm.first_name || ''} ${editForm.last_name || ''}`.trim() ||
                        'Update Your Name'
                      : profile.name || 'Student Name'}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center xl:justify-start space-x-2 mb-4"
                  >
                    <FaGraduationCap
                      style={{ color: 'var(--primary-500)' }}
                      className="text-lg"
                    />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: 'var(--primary-500)' }}
                    >
                      Student
                    </span>
                    {profile.program && (
                      <>
                        <span style={{ color: 'var(--gray-400)' }}>•</span>
                        <span style={{ color: 'var(--gray-600)' }}>
                          {profile.program}
                        </span>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Contact Info Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {[
                    { icon: FaEnvelope, value: profile.email, label: 'Email' },
                    { icon: FaPhone, value: profile.phone, label: 'Phone' },
                    {
                      icon: FaMapMarkerAlt,
                      value: profile.branch,
                      label: 'Branch',
                    },
                    {
                      icon: FaCalendarAlt,
                      value: profile.intake_year,
                      label: 'Intake Year',
                    },
                  ]
                    .filter(item => item.value)
                    .map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--gray-50)' }}
                      >
                        <item.icon
                          style={{ color: 'var(--primary-500)' }}
                          className="text-lg"
                        />
                        <div>
                          <p
                            className="text-sm"
                            style={{ color: 'var(--gray-500)' }}
                          >
                            {item.label}
                          </p>
                          <p
                            className="font-medium"
                            style={{ color: 'var(--gray-800)' }}
                          >
                            {item.value}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col space-y-3"
              >
                {!editMode ? (
                  <motion.button
                    onClick={handleEditModeToggle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                    style={{ backgroundColor: 'var(--primary-500)' }}
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </motion.button>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={{ scale: saving ? 1 : 1.05 }}
                      whileTap={{ scale: saving ? 1 : 0.95 }}
                      className="flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                      style={{ backgroundColor: 'var(--success-500)' }}
                    >
                      {saving ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaSave />
                      )}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                    <motion.button
                      onClick={handleEditModeToggle}
                      disabled={saving}
                      whileHover={{ scale: saving ? 1 : 1.05 }}
                      whileTap={{ scale: saving ? 1 : 0.95 }}
                      className="flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                      style={{ backgroundColor: 'var(--gray-500)' }}
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div
            className={`grid grid-cols-1 xl:grid-cols-3 gap-8 w-full ${styles.profileGrid || ''}`}
          >
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="xl:col-span-2 w-full"
            >
              <div
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border"
                style={{ borderColor: 'var(--primary-200)' }}
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: 'var(--primary-500)' }}
                  >
                    <FaUser className="text-white text-xl" />
                  </div>
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: 'var(--gray-800)' }}
                  >
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      field: 'first_name',
                      label: 'First Name',
                      icon: FaUser,
                      type: 'text',
                    },
                    {
                      field: 'last_name',
                      label: 'Last Name',
                      icon: FaUser,
                      type: 'text',
                    },
                    {
                      field: 'email',
                      label: 'Email',
                      icon: FaEnvelope,
                      type: 'email',
                      readonly: true,
                    },
                    {
                      field: 'phone',
                      label: 'Phone',
                      icon: FaPhone,
                      type: 'tel',
                    },
                    {
                      field: 'program',
                      label: 'Program',
                      icon: FaBook,
                      type: 'text',
                      readonly: true,
                    },
                    {
                      field: 'branch',
                      label: 'Branch',
                      icon: FaMapMarkerAlt,
                      type: 'text',
                      readonly: true,
                    },
                    {
                      field: 'intake_year',
                      label: 'Intake Year',
                      icon: FaCalendarAlt,
                      type: 'number',
                    },
                    {
                      field: 'graduation_year',
                      label: 'Graduation Year',
                      icon: FaAward,
                      type: 'number',
                    },
                  ].map(({ field, label, type, readonly = false }, index) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <label
                        className="flex items-center space-x-3 text-sm font-semibold"
                        style={{ color: 'var(--gray-700)' }}
                      >
                        <span>{label}</span>
                      </label>
                      {editMode && !readonly ? (
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type={type}
                          value={editForm[field] || ''}
                          onChange={e =>
                            handleFormChange(field, e.target.value)
                          }
                          className={`w-full p-4 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:shadow-lg ${styles.profileInput || ''}`}
                          style={{
                            borderColor: 'var(--gray-200)',
                            backgroundColor: 'var(--gray-50)',
                          }}
                          onFocus={e =>
                            (e.target.style.borderColor = 'var(--primary-500)')
                          }
                          onBlur={e =>
                            (e.target.style.borderColor = 'var(--gray-200)')
                          }
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      ) : (
                        <div
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${readonly ? 'opacity-60' : ''}`}
                          style={{
                            backgroundColor: readonly
                              ? 'var(--gray-100)'
                              : 'var(--gray-50)',
                            borderColor: 'var(--gray-200)',
                            color: 'var(--gray-700)',
                          }}
                        >
                          {profile[field] || 'Not provided'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bio Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="mt-8 space-y-3"
                >
                  <label
                    className="flex items-center space-x-3 text-sm font-semibold"
                    style={{ color: 'var(--gray-700)' }}
                  >
                    <FaUser
                      style={{ color: 'var(--primary-500)' }}
                      className="text-lg"
                    />
                    <span>Bio</span>
                  </label>
                  {editMode ? (
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      value={editForm.bio || ''}
                      onChange={e => handleFormChange('bio', e.target.value)}
                      rows={5}
                      className={`w-full p-4 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:shadow-lg resize-none ${styles.profileTextarea || ''}`}
                      style={{
                        borderColor: 'var(--gray-200)',
                        backgroundColor: 'var(--gray-50)',
                      }}
                      onFocus={e =>
                        (e.target.style.borderColor = 'var(--primary-500)')
                      }
                      onBlur={e =>
                        (e.target.style.borderColor = 'var(--gray-200)')
                      }
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div
                      className="p-4 rounded-2xl border-2 min-h-[120px]"
                      style={{
                        backgroundColor: 'var(--gray-50)',
                        borderColor: 'var(--gray-200)',
                        color: 'var(--gray-700)',
                      }}
                    >
                      {profile.bio || 'No bio provided'}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Sidebar Content */}
            <div className={`w-full space-y-8 ${styles.profileSidebar || ''}`}>
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border w-full"
                style={{ borderColor: 'var(--primary-200)' }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: 'var(--secondary-500)' }}
                  >
                    <FaLinkedin className="text-white text-xl" />
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: 'var(--gray-800)' }}
                  >
                    Social Links
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      field: 'linkedin_url',
                      label: 'LinkedIn',
                      icon: FaLinkedin,
                      color: '#0077B5',
                      bgColor: '#e7f3ff',
                    },
                    {
                      field: 'github_url',
                      label: 'GitHub',
                      icon: FaGithub,
                      color: 'var(--gray-800)',
                      bgColor: 'var(--gray-100)',
                    },
                    {
                      field: 'portfolio_url',
                      label: 'Portfolio',
                      icon: FaExternalLinkAlt,
                      color: 'var(--primary-500)',
                      bgColor: 'var(--primary-200)',
                    },
                  ].map(({ field, label, color, bgColor }, index) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <label
                        className="flex items-center space-x-3 text-sm font-semibold"
                        style={{ color: 'var(--gray-700)' }}
                      >
                        <span>{label}</span>
                      </label>
                      {editMode ? (
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="url"
                          value={editForm[field] || ''}
                          onChange={e =>
                            handleFormChange(field, e.target.value)
                          }
                          className={`w-full p-4 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:shadow-lg ${styles.socialInput || ''}`}
                          style={{
                            borderColor: 'var(--gray-200)',
                            backgroundColor: 'var(--gray-50)',
                          }}
                          onFocus={e => (e.target.style.borderColor = color)}
                          onBlur={e =>
                            (e.target.style.borderColor = 'var(--gray-200)')
                          }
                          placeholder={`Enter ${label.toLowerCase()} URL`}
                        />
                      ) : (
                        <div
                          className="p-4 rounded-2xl border-2 transition-all duration-300"
                          style={{
                            backgroundColor: profile[field]
                              ? bgColor
                              : 'var(--gray-50)',
                            borderColor: 'var(--gray-200)',
                          }}
                        >
                          {profile[field] ? (
                            <motion.a
                              href={profile[field]}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center justify-between group transition-all duration-300"
                              style={{ color }}
                            >
                              <span className="font-medium truncate pr-2">
                                {profile[field]}
                              </span>
                              <FaExternalLinkAlt className="text-sm opacity-60 group-hover:opacity-100" />
                            </motion.a>
                          ) : (
                            <span style={{ color: 'var(--gray-500)' }}>
                              Not provided
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CV Upload */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border w-full max-w-full ${styles.cvSection || 'cv-section'}`}
                style={{ borderColor: 'var(--primary-200)' }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-3 rounded-2xl"
                      style={{ backgroundColor: 'var(--primary-500)' }}
                    >
                      <FaFileUpload className="text-white text-xl" />
                    </div>
                    <h3
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: 'var(--gray-800)' }}
                    >
                      CV/Resume
                    </h3>
                  </div>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer font-semibold transition-all duration-300 shadow-md hover:shadow-lg w-fit"
                    style={{
                      backgroundColor: uploading
                        ? 'var(--gray-400)'
                        : 'var(--primary-500)',
                      color: 'white',
                    }}
                  >
                    {uploading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaFileUpload />
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      accept=".pdf,.doc,.docx"
                    />
                  </motion.label>
                </div>

                <div className="space-y-4 w-full max-w-full">
                  {!profile.cv_path && documents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                      className="text-center py-8 rounded-2xl w-full"
                      style={{ backgroundColor: 'var(--gray-50)' }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaFileUpload
                          className="mx-auto text-5xl mb-3"
                          style={{ color: 'var(--gray-300)' }}
                        />
                      </motion.div>
                      <p
                        className="text-base font-semibold mb-1"
                        style={{ color: 'var(--gray-600)' }}
                      >
                        No CV uploaded yet
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--gray-500)' }}
                      >
                        Upload your CV/Resume document
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3 w-full">
                      {profile.cv_path && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md group w-full gap-3"
                          style={{
                            backgroundColor: 'var(--gray-50)',
                            borderColor: 'var(--gray-200)',
                          }}
                        >
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div
                              className="p-2 rounded-xl flex-shrink-0"
                              style={{ backgroundColor: 'var(--primary-500)' }}
                            >
                              <FaFileUpload className="text-white text-base" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-semibold truncate"
                                style={{ color: 'var(--gray-800)' }}
                              >
                                Current CV
                              </p>
                              <p
                                className="text-sm truncate"
                                style={{ color: 'var(--gray-500)' }}
                              >
                                {profile.cv_path
                                  .split('\\')
                                  .pop()
                                  ?.substring(0, 30) || 'CV Document'}
                                {(profile.cv_path.split('\\').pop()?.length ||
                                  0) > 30
                                  ? '...'
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 flex-shrink-0 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl transition-all duration-300"
                              style={{ backgroundColor: 'var(--info-500)' }}
                              title="Download CV"
                            >
                              <FaDownload className="text-white text-sm" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteDocument('current')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl transition-all duration-300"
                              style={{ backgroundColor: 'var(--error-500)' }}
                              title="Delete CV"
                            >
                              <FaTrash className="text-white text-sm" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      {documents.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md group w-full gap-3"
                          style={{
                            backgroundColor: 'var(--gray-50)',
                            borderColor: 'var(--gray-200)',
                          }}
                        >
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div
                              className="p-2 rounded-xl flex-shrink-0"
                              style={{ backgroundColor: 'var(--primary-500)' }}
                            >
                              <FaFileUpload className="text-white text-base" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-semibold truncate"
                                style={{ color: 'var(--gray-800)' }}
                              >
                                {doc.name.length > 25
                                  ? `${doc.name.substring(0, 25)}...`
                                  : doc.name}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: 'var(--gray-500)' }}
                              >
                                {doc.date} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteDocument(doc.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-xl transition-all duration-300 flex-shrink-0"
                            style={{ backgroundColor: 'var(--error-500)' }}
                            title="Delete Document"
                          >
                            <FaTrash className="text-white text-sm" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default Profile;
