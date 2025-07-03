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
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id || payload.sub;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      setCurrentUserId(userId);
      const response = await fetch(`${API_BASE_URL}/api/test/users/${userId}`, {
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
    } catch {
      setError('Failed to load profile');
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

  useEffect(() => {
    fetchProfile();
    fetchMessages();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const nameParts = editForm.name?.trim().split(' ') || ['', ''];
      const updateData = {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        phone: editForm.phone,
        bio: editForm.bio,
        linkedin_url: editForm.linkedin_url,
        github_url: editForm.github_url,
        portfolio_url: editForm.portfolio_url,
        intake_year: editForm.intake_year,
        graduation_year: editForm.graduation_year,
      };

      // استخدام API الصحيح
      const response = await fetch(
        `${API_BASE_URL}/api/test/users/${currentUserId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        setProfile({ ...editForm });
        setEditMode(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to update');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const markRead = async id => {
    try {
      const token = localStorage.getItem('token');
      // إرسال طلب لتحديث حالة الرسالة في قاعدة البيانات
      await fetch(`${API_BASE_URL}/api/bulk-messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث الواجهة
      setMessages(msgs =>
        msgs.map(m => (m.id === id ? { ...m, unread: false } : m))
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const deleteMsg = async id => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/bulk-messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(msgs => msgs.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

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
                  onClick={() => {
                    setEditForm({ ...profile });
                    setEditMode(true);
                  }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
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
                ['course', 'Course', 'text', true],
                ['email', 'Email', 'email', true],
                ['phone', 'Phone', 'tel'],
                ['intake_year', 'Intake Year', 'number'],
                ['graduation_year', 'Graduation Year', 'number'],
              ].map(([field, label, type, readonly = false]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  {editMode && !readonly ? (
                    <input
                      type={type}
                      value={editForm[field] || ''}
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
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
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {editMode ? (
                <textarea
                  value={editForm.bio || ''}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, bio: e.target.value }))
                  }
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
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
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
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
                  onClick={() => {
                    setEditForm({});
                    setEditMode(false);
                    setError(null);
                  }}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
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
                <FaFileUpload /> Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={e => {
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
                  }}
                />
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
                      onClick={() =>
                        setDocuments(docs => docs.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
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
                    className={`p-4 rounded border-l-4 ${
                      msg.unread
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
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
