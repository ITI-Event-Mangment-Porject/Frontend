import React, { useState } from 'react';
import { FaFileUpload, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 890',
    university: 'ABC University',
    course: 'B.Tech Computer Science',
    bio: 'Passionate about technology and innovation. Seeking opportunities to learn and grow.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState({
    eventUpdates: true,
    interviewReminders: false,
    newsletter: true,
  });
  const [documents, setDocuments] = useState([
    { name: 'CV.pdf', date: '2025-06-01', size: '120 KB' },
    { name: 'certificate.png', date: '2025-05-20', size: '340 KB' },
  ]);

  const handleToggle = key =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const handleEditProfile = () => {
    setEditForm({ ...profile });
    setEditMode(true);
  };
  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setEditMode(false);
  };
  const handleCancelEdit = () => {
    setEditForm({});
    setEditMode(false);
  };
  const handleInputChange = (field, value) =>
    setEditForm(prev => ({ ...prev, [field]: value }));
  const handleDeleteDoc = idx =>
    setDocuments(docs => docs.filter((_, i) => i !== idx));
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

  const StatusBadge = ({ status }) => {
    const colors = {
      Registered: 'bg-blue-500',
      Attended: 'bg-green-500',
      Upcoming: 'bg-orange-500',
      Selected: 'bg-green-500',
      Rejected: 'bg-red-500',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs text-white ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="bg-gray-50 w-375 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 space-y-6">
            {/* Profile */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
                />
                <div>
                  <h3 className="text-2xl font-semibold">{profile.name}</h3>
                  <p className="text-gray-500">Student</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['University', profile.university],
                  ['Course', profile.course],
                  ['Email', profile.email],
                  ['Phone', profile.phone],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <div className="bg-gray-100 p-3 rounded">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <div className="bg-gray-100 p-3 rounded">{profile.bio}</div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">CV & Documents</h3>
                <label className="flex items-center gap-2 text-orange-500 cursor-pointer">
                  <FaFileUpload />
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="pb-2">File Name</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3">{doc.name}</td>
                      <td className="py-3">{doc.date}</td>
                      <td className="py-3">{doc.size}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            className="text-red-500"
                            onClick={() => handleDeleteDoc(idx)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  ['eventUpdates', 'Event Updates'],
                  ['interviewReminders', 'Interview Reminders'],
                  ['newsletter', 'Newsletter'],
                ].map(([key, label]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-700">{label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() => handleToggle(key)}
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full ${notifications[key] ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications[key] ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}
                        ></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Events & Interviews */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Registered Events</h3>
                <div className="space-y-3">
                  {[
                    ['AI Summit 2025', 'Registered'],
                    ['Tech Bootcamp', 'Upcoming'],
                    ['AI Educational Expo', 'Attended'],
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Interview History</h3>
                <div className="space-y-3">
                  {[
                    ['Creative Innovations', '2025-06-10', 'Selected'],
                    ['Digital Solutions', '2025-06-05', 'Rejected'],
                    ['Applied Tech', '2025-05-28', 'Selected'],
                  ].map(([company, date, status], idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{company}</p>
                          <p className="text-sm text-gray-500">{date}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Messages</h3>
              <div className="space-y-3">
                {[
                  [
                    'System',
                    'New job placement opportunities available',
                    '2025-06-12',
                    true,
                  ],
                  [
                    'Career Services',
                    'Your application has been submitted successfully',
                    '2025-06-10',
                    false,
                  ],
                  [
                    'Admin',
                    'Profile verification completed',
                    '2025-06-08',
                    false,
                  ],
                ].map(([from, text, date, unread], idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded border-l-4 ${unread ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{from}</p>
                        <p className="text-gray-600 mt-1">{text}</p>
                      </div>
                      <span className="text-sm text-gray-500">{date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['name', 'Name'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['university', 'University'],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={editForm[field] || ''}
                        onChange={e => handleInputChange(field, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    value={editForm.course || ''}
                    onChange={e => handleInputChange('course', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.bio || ''}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Profile;
