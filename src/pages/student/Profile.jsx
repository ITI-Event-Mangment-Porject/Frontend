import React, { useState, useEffect } from 'react';
import {
  FaFileUpload,
  FaTrash,
  FaSpinner,
  FaEye,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    bio: '',
    avatar: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    intake_year: null,
    graduation_year: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/test/users/1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success && data.data.user) {
        const user = data.data.user;
        const profileData = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          course: user.track?.name || '',
          bio: user.bio || '',
          avatar:
            user.profile_image || 'https://via.placeholder.com/200x200.png',
          linkedin_url: user.linkedin_url || '',
          github_url: user.github_url || '',
          portfolio_url: user.portfolio_url || '',
          intake_year: user.intake_year,
          graduation_year: user.graduation_year,
        };
        setProfile(profileData);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bulk-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessages(
        (data.data || []).map(msg => ({
          id: msg.id,
          from: msg.sender_name || 'Unknown',
          text: msg.message || '',
          date: msg.created_at
            ? new Date(msg.created_at).toLocaleDateString()
            : '',
          unread: msg.unread ?? true,
        }))
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Fetch notifications from the new API
  const fetchNotificationsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNotificationsList(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotificationsList([]);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMessages();
    fetchNotificationsList();
  }, []);

  const handleEdit = () => {
    setEditForm({ ...profile });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      // Split name back to first_name and last_name
      const nameParts = editForm.name
        ? editForm.name.trim().split(' ')
        : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        phone: editForm.phone,
        bio: editForm.bio,
        linkedin_url: editForm.linkedin_url,
        github_url: editForm.github_url,
        portfolio_url: editForm.portfolio_url,
        intake_year: editForm.intake_year,
        graduation_year: editForm.graduation_year,
      };

      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProfile({ ...editForm });
        setEditMode(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({});
    setEditMode(false);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = e => {
    const file = e.target.files[0];
    if (file)
      setDocuments(docs => [
        ...docs,
        {
          name: file.name,
          date: new Date().toISOString().slice(0, 10),
          size: `${Math.round(file.size / 1024)} KB`,
        },
      ]);
  };

  const deleteDoc = idx =>
    setDocuments(docs => docs.filter((_, i) => i !== idx));
  const markRead = id =>
    setMessages(msgs =>
      msgs.map(m => (m.id === id ? { ...m, unread: false } : m))
    );
  const deleteMsg = id => setMessages(msgs => msgs.filter(m => m.id !== id));

  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 py-1 rounded text-xs text-white ${
        status === 'Selected'
          ? 'bg-green-500'
          : status === 'Rejected'
            ? 'bg-red-500'
            : status === 'Upcoming'
              ? 'bg-orange-500'
              : 'bg-blue-500'
      }`}
    >
      {status}
    </span>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-orange-500 text-2xl" />
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}{' '}
                <button onClick={fetchProfile} className="ml-2 underline">
                  Retry
                </button>
              </div>
            )}

            <div className="flex items-center gap-6 mb-6">
              <img
                src={
                  editMode ? editForm.avatar || profile.avatar : profile.avatar
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
              />
              <div>
                <h3 className="text-2xl font-semibold">
                  {editMode ? editForm.name || profile.name : profile.name}
                </h3>
                <p className="text-gray-500">Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                ['name', 'Name', 'text'],
                ['course', 'Course', 'text', true], // readonly
                ['email', 'Email', 'email', true], // readonly
                ['phone', 'Phone', 'tel'],
                ['intake_year', 'Intake Year', 'number'],
                ['graduation_year', 'Graduation Year', 'number'],
              ].map(([field, label, type, readonly = false]) => {
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    {editMode && !readonly ? (
                      <input
                        type={type}
                        value={editForm[field] || ''}
                        onChange={e => handleInputChange(field, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <div
                        className={`p-3 rounded ${readonly ? 'bg-gray-50' : 'bg-gray-100'}`}
                      >
                        {profile[field] || 'Not provided'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {editMode ? (
                <textarea
                  value={editForm.bio || ''}
                  onChange={e => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="bg-gray-100 p-3 rounded">
                  {profile.bio || 'No bio provided'}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                ['linkedin_url', 'LinkedIn URL'],
                ['github_url', 'GitHub URL'],
                ['portfolio_url', 'Portfolio URL'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  {editMode ? (
                    <input
                      type="url"
                      value={editForm[field] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  ) : (
                    <div className="bg-gray-100 p-3 rounded">
                      {profile[field] ? (
                        <a
                          href={profile[field]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {profile[field]}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {editMode && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Documents</h3>
              <label className="flex items-center gap-2 text-orange-500 cursor-pointer hover:text-orange-600">
                <FaFileUpload /> Upload{' '}
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            </div>
            <div className="space-y-2">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaFileUpload className="mx-auto text-4xl mb-2" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.date} - {doc.size}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDoc(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grid for Events/Interviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Events</h3>
              <div className="space-y-3">
                {[
                  ['AI Summit 2025', 'Registered'],
                  ['Tech Bootcamp', 'Upcoming'],
                ].map(([name, status], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span>{name}</span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Interviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Interviews</h3>
              <div className="space-y-3">
                {[
                  ['Creative Innovations', 'Selected'],
                  ['Digital Solutions', 'Rejected'],
                ].map(([company, status], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span>{company}</span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Messages</h3>
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded border-l-4 ${msg.unread ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{msg.from}</p>
                          {msg.unread && (
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{msg.text}</p>
                        <span className="text-sm text-gray-500">
                          {msg.date}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {msg.unread && (
                          <button
                            onClick={() => markRead(msg.id)}
                            className="text-orange-500 hover:text-orange-700"
                            title="Mark as read"
                          >
                            <FaEye />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMsg(msg.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete message"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          {/* Notification Preferences section removed */}

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Your Notifications</h3>
            <div className="space-y-3">
              {notificationsList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No notifications yet</p>
                </div>
              ) : (
                notificationsList.map((notif, idx) => (
                  <div
                    key={notif.id || idx}
                    className="p-4 rounded border-l-4 border-orange-500 bg-orange-50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {notif.title || 'Notification'}
                        </p>
                        <p className="text-gray-600 mb-1">
                          {notif.body || notif.message || ''}
                        </p>
                        <span className="text-sm text-gray-500">
                          {notif.created_at
                            ? new Date(notif.created_at).toLocaleString()
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t mt-auto">
        <div className="px-4 sm:px-6 py-4 text-center text-gray-600 max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Profile;
