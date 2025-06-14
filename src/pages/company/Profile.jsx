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
    console.log("Saving company data:", companyData);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#203947' }}>Company Profile</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your company's public information, team members, and branding assets.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                    style={{ backgroundColor: '#901b20' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ad565a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#901b20'}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center justify-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                      style={{ backgroundColor: '#203947' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4a5a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#203947'}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center justify-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                      style={{ backgroundColor: '#cc9598' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#d4a5a8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#cc9598'}
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
                <h2 className="text-lg font-semibold" style={{ color: '#203947' }}>Company Details</h2>
                <p className="text-gray-600 text-sm">Manage your basic company information and contact details.</p>
              </div>
              
              <div className="p-4 sm:p-6 space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent group-hover:border-gray-400"
                      style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                      onFocus={(e) => e.target.style.borderColor = '#901b20'}
                      onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                    />
                  ) : (
                    <p className="text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">{companyData.name}</p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Description</label>
                  {isEditing ? (
                    <textarea
                      value={companyData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent resize-none"
                      style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                      onFocus={(e) => e.target.style.borderColor = '#901b20'}
                      onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                    />
                  ) : (
                    <p className="text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">{companyData.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                        style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                        onFocus={(e) => e.target.style.borderColor = '#901b20'}
                        onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a 
                          href={`mailto:${companyData.email}`} 
                          className="transition-colors duration-200 hover:underline"
                          style={{ color: '#901b20' }}
                        >
                          {companyData.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                        style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                        onFocus={(e) => e.target.style.borderColor = '#901b20'}
                        onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{companyData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                      style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                      onFocus={(e) => e.target.style.borderColor = '#901b20'}
                      onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a 
                        href={companyData.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="transition-colors duration-200 hover:underline"
                        style={{ color: '#901b20' }}
                      >
                        {companyData.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#203947' }}>Address</label>
                  {isEditing ? (
                    <textarea
                      value={companyData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent resize-none"
                      style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                      onFocus={(e) => e.target.style.borderColor = '#901b20'}
                      onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                    />
                  ) : (
                    <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-gray-900">{companyData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: '#203947' }}>Team Members</h2>
                    <p className="text-gray-600 text-sm">Manage team members with access to your company's HR account.</p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setNewMember({ name: "", role: "", email: "" })}
                      className="inline-flex items-center px-3 py-2 text-sm text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                      style={{ backgroundColor: '#901b20' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ad565a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#901b20'}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Member
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center space-x-3 p-4 border rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
                      style={{ borderColor: '#ebebeb' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
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
                          className="text-red-500 hover:text-red-700 transition-all duration-300 transform hover:scale-110 p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Member Form */}
                {isEditing && (
                  <div className="mt-6 p-4 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-solid" style={{ borderColor: '#cc9598' }}>
                    <h3 className="font-medium mb-3" style={{ color: '#203947' }}>Add New Member</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                        style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                        onFocus={(e) => e.target.style.borderColor = '#901b20'}
                        onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                        className="px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                        style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                        onFocus={(e) => e.target.style.borderColor = '#901b20'}
                        onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        className="px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:border-transparent"
                        style={{ borderColor: '#ebebeb', '--tw-ring-color': '#901b20' }}
                        onFocus={(e) => e.target.style.borderColor = '#901b20'}
                        onBlur={(e) => e.target.style.borderColor = '#ebebeb'}
                      />
                    </div>
                    <button
                      onClick={handleAddMember}
                      className="mt-3 inline-flex items-center px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                      style={{ backgroundColor: '#203947' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4a5a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#203947'}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Branding Assets */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
                <h2 className="text-lg font-semibold" style={{ color: '#203947' }}>Branding Assets</h2>
                <p className="text-gray-600 text-sm">Upload and manage your company's logo and visual elements.</p>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#203947' }}>Main Company Logo</label>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: '#ebebeb' }}
                    >
                      {companyData.logo ? (
                        <img src={companyData.logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Briefcase className="w-8 h-8" style={{ color: '#901b20' }} />
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleImageUpload('logo')}
                        className="inline-flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                        style={{ backgroundColor: '#ebebeb', color: '#203947' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dcdcdc'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ebebeb'}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Logo
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#203947' }}>Job Fair Banner Image</label>
                  <div className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg">
                    <img
                      src={companyData.bannerImage}
                      alt="Banner"
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleImageUpload('bannerImage')}
                        className="absolute top-2 right-2 inline-flex items-center px-3 py-2 text-sm bg-black bg-opacity-50 text-white rounded-lg transition-all duration-300 hover:bg-opacity-70 transform hover:scale-105"
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
                <h3 className="text-lg font-semibold" style={{ color: '#203947' }}>Job Fair Statistics</h3>
                <p className="text-gray-600 text-sm">Key metrics from your participation in job fairs.</p>
              </div>
              
              <div className="p-4 sm:p-6 space-y-6">
                <div className="text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="text-3xl font-bold transition-colors duration-300" style={{ color: '#901b20' }}>{jobFairStats.totalFairs}</div>
                  <div className="text-sm text-gray-600">Available Job Fairs</div>
                </div>
                
                <div className="text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="text-3xl font-bold transition-colors duration-300" style={{ color: '#203947' }}>{jobFairStats.fairsParticipated}</div>
                  <div className="text-sm text-gray-600">Fairs Participated</div>
                </div>
                
                <div className="text-center p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="text-3xl font-bold transition-colors duration-300" style={{ color: '#ad565a' }}>{jobFairStats.totalViews}</div>
                  <div className="text-sm text-gray-600">Total Profile Views</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#ebebeb' }}>
                <h3 className="text-lg font-semibold" style={{ color: '#203947' }}>Quick Overview</h3>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Team Size</span>
                  </div>
                  <span className="font-medium" style={{ color: '#203947' }}>{teamMembers.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Active Jobs</span>
                  </div>
                  <span className="font-medium" style={{ color: '#203947' }}>7</span>
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