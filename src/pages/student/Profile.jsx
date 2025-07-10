import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fa';
import defaultProfileImage from '../../assets/images/profile.png';
import Layout from '../../components/student/Layout'; 
import Footer from '../../components/student/Footer';

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
          avatar: user.profile_image || 'https://via.placeholder.com/200x200.png',
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
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
        intake_year: editForm.intake_year ? parseInt(editForm.intake_year) : null,
        graduation_year: editForm.graduation_year ? parseInt(editForm.graduation_year) : null,
        profile_img: editForm.profile_img || defaultProfileImage, 
      };

     
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
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        // تحديث الـ profile بناءً على البيانات المرجعة من الـ API
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
          avatar: updatedUser.profile_image || 'https://via.placeholder.com/200x200.png',
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
        setSuccess(data.message || 'Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch(`${API_BASE_URL}/api/users/${currentUserId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CV');
      }

      const data = await response.json();
      
      if (data.success) {
        // تحديث المسار في الـ profile
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
        setSuccess('CV uploaded successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to upload CV: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const token = localStorage.getItem('token');
      
      // حذف الـ CV من الـ API
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
        setSuccess('CV deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to delete CV: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <FaSpinner className="animate-spin text-red-900 text-4xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <FaCheckCircle className="text-green-500 text-xl" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <div className="flex-1">
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="text-red-500 hover:text-red-700 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative">
                <img
                  src={editMode ? editForm.avatar || profile : defaultProfileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-red-900 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-red-900 rounded-full p-2">
                  <FaUser className="text-white text-lg" />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {editMode ? `${editForm.first_name || ''} ${editForm.last_name || ''}`.trim() : profile.name}
                </h1>
                <p className="text-red-900 font-semibold mb-1">Student</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  {profile.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaEnvelope className="text-red-900" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaPhone className="text-red-900" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.program && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaBook className="text-red-900" />
                      <span>{profile.program}</span>
                    </div>
                  )}
                  {profile.branch && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaMapMarkerAlt className="text-red-900" />
                      <span>{profile.branch}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!editMode ? (
                  <button
                    onClick={() => {
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
                        avatar: profile.avatar || defaultProfileImage,
                        profile_img: profile.avatar || defaultProfileImage,
                      });
                      setEditMode(true);
                      setError(null);
                    }}
                    className="flex items-center space-x-2 bg-red-900 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditForm({});
                        setEditMode(false);
                        setError(null);
                      }}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { field: 'first_name', label: 'First Name', icon: FaUser, type: 'text' },
                    { field: 'last_name', label: 'Last Name', icon: FaUser, type: 'text' },
                    { field: 'email', label: 'Email', icon: FaEnvelope, type: 'email', readonly: true },
                    { field: 'phone', label: 'Phone', icon: FaPhone, type: 'tel' },
                    { field: 'program', label: 'Program', icon: FaBook, type: 'text', readonly: true },
                    { field: 'branch', label: 'Branch', icon: FaMapMarkerAlt, type: 'text', readonly: true },
                    { field: 'intake_year', label: 'Intake', icon: FaCalendarAlt, type: 'number' },
                    { field: 'graduation_year', label: 'Graduation Year', icon: FaCalendarAlt, type: 'number' },
                  ].map(({ field, label, icon: Icon, type, readonly = false }) => (
                    <div key={field} className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Icon className="text-red-900" />
                        <span>{label}</span>
                      </label>
                      {editMode && !readonly ? (
                        <input
                          type={type}
                          value={editForm[field] || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      ) : (
                        <div className={`p-3 rounded-lg ${readonly ? 'bg-gray-50' : 'bg-gray-100'} border`}>
                          {profile[field] || 'Not provided'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  {editMode ? (
                    <textarea
                      value={editForm.bio || ''}
                      onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="bg-gray-100 p-3 rounded-lg border">
                      {profile.bio || 'No bio provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links & CV */}
            <div className="space-y-8">
              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Social Links</h3>
                
                <div className="space-y-4">
                  {[
                    { field: 'linkedin_url', label: 'LinkedIn', icon: FaLinkedin, color: 'blue' },
                    { field: 'github_url', label: 'GitHub', icon: FaGithub, color: 'gray' },
                    { field: 'portfolio_url', label: 'Portfolio', icon: FaExternalLinkAlt, color: 'purple' },
                  ].map(({ field, label, icon: Icon, color }) => (
                    <div key={field} className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <Icon className={`text-${color}-500`} />
                        <span>{label}</span>
                      </label>
                      {editMode ? (
                        <input
                          type="url"
                          value={editForm[field] || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition-all"
                          placeholder={`Enter ${label.toLowerCase()} URL`}
                        />
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-lg border">
                          {profile[field] ? (
                            <a
                              href={profile[field]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all flex items-center space-x-1"
                            >
                              <span>{profile[field]}</span>
                              <FaExternalLinkAlt className="text-xs" />
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CV Upload */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">CV/Resume</h3>
                  <label className="flex items-center space-x-2 text-red-900 cursor-pointer hover:text-red-900 transition-colors">
                    {uploading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaFileUpload />
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload CV'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
                
                <div className="space-y-3">
                  {!profile.cv_path && documents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FaFileUpload className="mx-auto text-6xl mb-4 text-gray-300" />
                      <p className="text-lg">No CV uploaded yet</p>
                      <p className="text-sm">Upload your CV/Resume document</p>
                    </div>
                  ) : (
                    <>
                      {profile.cv_path && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">Current CV</p>
                            <p className="text-sm text-gray-500">
                              {profile.cv_path.split('\\').pop() || 'CV Document'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument('current')}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.date} • {doc.size}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Profile;