import React, { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2, Upload, Users, Briefcase, TrendingUp, Mail, Phone, Globe, MapPin, User } from 'lucide-react';

const CompanyProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "Tech Solutions Inc.",
    description: "A leading innovator in cloud computing and AI solutions, dedicated to empowering businesses with cutting-edge technology.",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
    website: "https://www.techsolutions.com",
    address: "123 Innovation Drive, Suite 400, Techville, CA 90210",
    logo: null,
    bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      role: "CEO & Founder",
      avatar: "👩‍💼",
      email: "alice@techsolutions.com"
    },
    {
      id: 2,
      name: "Bob Smith",
      role: "CTO",
      avatar: "👨‍💻",
      email: "bob@techsolutions.com"
    },
    {
      id: 3,
      name: "Carol White",
      role: "Head of Marketing",
      avatar: "👩‍💼",
      email: "carol@techsolutions.com"
    },
    {
      id: 4,
      name: "David Green",
      role: "Lead Developer",
      avatar: "👨‍💻",
      email: "david@techsolutions.com"
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: ""
  });

  const jobFairStats = {
    totalFairs: 125,
    fairsParticipated: 18,
    totalViews: 560
  };

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Saving company data:", companyData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here you would typically revert changes
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      const member = {
        id: Date.now(),
        ...newMember,
        avatar: "👤"
      };
      setTeamMembers(prev => [...prev, member]);
      setNewMember({ name: "", role: "", email: "" });
    }
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleImageUpload = (field) => {
    // Simulate image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleInputChange(field, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
                <p className="text-gray-600 mt-1">Manage your company's public information, team members, and branding assets.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Details */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>
                <p className="text-gray-600 text-sm">Manage your basic company information and contact details.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  {isEditing ? (
                    <textarea
                      value={companyData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{companyData.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a href={`mailto:${companyData.email}`} className="text-blue-600 hover:underline">
                          {companyData.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{companyData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {companyData.website}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={companyData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-gray-900">{companyData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                    <p className="text-gray-600 text-sm">Manage team members with access to your company's HR account.</p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setNewMember({ name: "", role: "", email: "" })}
                      className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Member
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="text-2xl">{member.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{member.role}</p>
                        {member.email && (
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Member Form */}
                {isEditing && (
                  <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Add New Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleAddMember}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Branding Assets */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Branding Assets</h2>
                <p className="text-gray-600 text-sm">Upload and manage your company's logo and visual elements.</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Main Company Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      {companyData.logo ? (
                        <img src={companyData.logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Briefcase className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleImageUpload('logo')}
                        className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Logo
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Job Fair Banner Image</label>
                  <div className="relative">
                    <img
                      src={companyData.bannerImage}
                      alt="Banner"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleImageUpload('bannerImage')}
                        className="absolute top-2 right-2 inline-flex items-center px-3 py-2 text-sm bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Fair Statistics */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Job Fair Statistics</h3>
                <p className="text-gray-600 text-sm">Key metrics from your participation in job fairs.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{jobFairStats.totalFairs}</div>
                  <div className="text-sm text-gray-600">Available Job Fairs</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{jobFairStats.fairsParticipated}</div>
                  <div className="text-sm text-gray-600">Fairs Participated</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{jobFairStats.totalViews}</div>
                  <div className="text-sm text-gray-600">Total Profile Views</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Overview</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Team Size</span>
                  </div>
                  <span className="font-medium text-gray-900">{teamMembers.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Active Jobs</span>
                  </div>
                  <span className="font-medium text-gray-900">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;