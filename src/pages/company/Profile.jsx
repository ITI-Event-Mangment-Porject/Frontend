import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Edit3, Save, X, Briefcase, Mail, Phone, Globe, MapPin, Loader2
} from 'lucide-react';
import api from '../../api/axios'; 

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    location: "",
    logo_path: "",
    industry: "",
    size: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

useEffect(() => {
  console.log("companyId", companyId);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response.data);

      const result = response.data?.data?.result || {};

setCompanyData({
  ...result,
  logo_path: result.logo_path 
    ? result.logo_path.startsWith('http')
      ? result.logo_path
      : `http://127.0.0.1:8000/storage/${result.logo_path}`
    : ''
});


    } catch (err) {
      setError("Failed to fetch company data");
    }
    setLoading(false);
  };

  fetchCompany();
}, [companyId, token]);

  

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const { logo_path, ...rest } = companyData;

      const updatedData = {
        contact_email: rest.contact_email || '',
        contact_phone: rest.contact_phone || '',
        name: rest.name || '',
        industry: rest.industry || '',
        location: rest.location || '',
        website: rest.website || '',
        size: rest.size || '',
        description: rest.description || '',
      };

      const response = await axios.put(`http://127.0.0.1:8000/api/companies/${companyId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success === 'true' || response.data.success === true) {
        setIsEditing(false);
        window.location.reload(); 
      } else {
        setError("Update failed: " + (response.data.message || "Unknown error"));
      }

    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      if (err.response?.status === 422) {
        const errorMsg = err.response?.data?.message || "Validation failed";
        setError(errorMsg);
      } else {
        setError("Failed to update company");
      }
    }

    setLoading(false);
  };

const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    setError("Please select a valid image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("File size must be less than 5MB");
    return;
  }

  const formData = new FormData();
  formData.append('logo', file);

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/companies/${companyId}/logo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log("Upload response", response.data);

    const newLogoPath = response.data.logo_path;

    setCompanyData(prev => ({
      ...prev,
      logo_path: typeof newLogoPath === 'string'
        ? newLogoPath.replace('127.0.0.1', 'localhost')
        : ''
    }));

  } catch (err) {
    console.log("Upload error:", err.response?.data || err.message);
    setError("Logo upload failed");
  }
};


  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

const getSizeLabel = (value) => {
  switch (value) {
    case 'small':
      return 'Small (1–50 employees)';
    case 'medium':
      return 'Medium (51–200 employees)';
    case 'large':
      return 'Large (200+ employees)';
    default:
      return 'Not specified';
  }
};


  return (
    <div> 
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-[#901b20]/5 to-[#ad565a]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-[#203947]/5 to-[#901b20]/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-[#ad565a]/5 to-[#203947]/5 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Profile Card */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01] group">
{/* Modern Card Header Style */}
<div className="relative h-48 bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] overflow-hidden rounded-t-3xl">
  {/* Overlays & Effects */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
  
  {/* Floating Pulses */}
  <div className="absolute top-10 right-10 w-16 h-16 bg-white/5 rounded-full blur-sm animate-pulse"></div>
  <div className="absolute bottom-6 left-10 w-24 h-24 bg-[#901b20]/10 rounded-full blur-lg animate-pulse delay-1000"></div>
</div>

          
          <div className="px-8 lg:px-16 pb-12 -mt-24 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Logo Section */}
              <div className="relative group/logo">
                <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/30 to-[#ad565a]/30 rounded-3xl blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
                {companyData.logo_path ? (
                  <div className="relative w-36 h-36 rounded-3xl border-4 border-white/30 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden group-hover/logo:scale-110 transition-all duration-500">
                    <img 
                      src={companyData.logo_path} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-36 h-36 bg-gradient-to-br from-white/90 to-white/70 border-4 border-white/30 shadow-2xl rounded-3xl flex items-center justify-center group-hover/logo:scale-110 transition-all duration-500 backdrop-blur-sm">
                    <Briefcase className="w-16 h-16 text-[#901b20]" />
                  </div>
                )}
                {isEditing && (
                  <div className="mt-6">
                    <label 
                      htmlFor="logo-upload" 
                      className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 hover:from-[#901b20] hover:to-[#ad565a] text-white px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      Upload Logo
                    </label>
                    <input 
                      id="logo-upload"
                      type="file" 
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>
                )}
              </div>

              {/* Company Info and Action Buttons */}
              <div className="flex-1 flex flex-col lg:flex-row justify-between items-start gap-8">
                {/* Company Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      value={companyData.name || ''}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="text-3xl lg:text-5xl font-bold border-2 border-white/30 focus:border-[#901b20]/50 p-4 w-full rounded-2xl bg-white/20 backdrop-blur-sm focus:bg-white/30 transition-all duration-300 text-white placeholder-white/60 mb-4"
                      placeholder="Company Name"
                    />
                  ) : (
                    <h1 className="text-3xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight mb-4">
                      {companyData.name || 'Company Name'}
                    </h1>
                  )}
                  
                  <div className="mb-6">
                    {isEditing ? (
                      <input
                        value={companyData.industry || ''}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="border-2 border-white/30 focus:border-[#901b20]/50 p-3 rounded-2xl bg-white/20 backdrop-blur-sm focus:bg-white/30 transition-all duration-300 placeholder-white/60 "
                        placeholder="Industry"
                      />
                    ) : (
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-white/20 to-white/10  text-sm font-semibold rounded-full border border-white/30 shadow-lg hover:shadow-xl text-white transition-all duration-300 backdrop-blur-sm">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {companyData.industry || 'Industry Not Specified'}
                      </span>
                    )}
                  </div>

                  {/* Company Size */}
                  <div className="mb-6">
                    {isEditing ? (
                      <select
                        value={companyData.size || ''}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                        className="border-2 border-white/30 focus:border-[#901b20]/50 rounded-2xl p-3 bg-white/20 backdrop-blur-sm focus:bg-white/30 transition-all duration-300"
                      >
                        <option value="">Select company size</option>
                        <option value="small">Small (1–50 employees)</option>
                        <option value="medium">Medium (51–200 employees)</option>
                        <option value="large">Large (200+ employees)</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 bg-white/10 rounded-xl font-medium shadow-sm border border-white/20">
                        {getSizeLabel(companyData.size)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 lg:self-start">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="group/btn bg-gradient-to-r from-[#901b20]/90 to-[#ad565a]/90 hover:from-[#901b20] hover:to-[#ad565a] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                    >
                      <Edit3 className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12" /> 
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleSave} 
                        disabled={loading} 
                        className="group/btn bg-gradient-to-r from-[#203947]/90 to-[#203947] hover:from-[#203947] hover:to-[#1a2d38] text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={handleCancel} 
                        className="group/btn bg-gradient-to-r from-slate-500/90 to-slate-600/90 hover:from-slate-600 hover:to-slate-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                      >
                        <X className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-90" /> 
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/20 p-10 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01] group/desc mb-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#901b20]/20 to-[#ad565a]/20 rounded-2xl flex items-center justify-center mr-4 group-hover/desc:from-[#901b20]/30 group-hover/desc:to-[#ad565a]/30 transition-all duration-300 shadow-lg">
              <Edit3 className="w-7 h-7 text-[#901b20]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-700">Company Description</h2>
          </div>
          
          {isEditing ? (
            <textarea
              value={companyData.description || ''}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border-2 border-white/30 focus:border-[#901b20]/50 rounded-2xl p-6 bg-white/20 backdrop-blur-sm focus:bg-white/30 transition-all duration-300 text-slate-700 resize-none placeholder-slate-500 min-h-[200px]"
              rows="8"
              placeholder="Write a comprehensive description about your company, its mission, values, and what makes it unique..."
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed">
                {companyData.description || (
                  <span className="text-slate-400 italic">
                    No company description available. Click edit to add one.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Contact Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Email Address", field: "contact_email", icon: Mail, type: "email" },
            { label: "Phone Number", field: "contact_phone", icon: Phone, type: "tel" },
            { label: "Website", field: "website", icon: Globe, type: "url" },
            { label: "Office Location", field: "location", icon: MapPin, type: "text" }
          ].map(({ label, field, icon: Icon, type }) => (
            <div key={field} className="group/card">
              <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:border-[#901b20]/30 transition-all duration-500 h-full transform hover:scale-105 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#901b20]/20 to-[#ad565a]/20 rounded-2xl flex items-center justify-center mr-4 group-hover/card:from-[#901b20]/30 group-hover/card:to-[#ad565a]/30 transition-all duration-300 shadow-lg">
                    <Icon className="w-7 h-7 text-[#901b20]" />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-700">{label}</h3>
                </div>
                
                {isEditing ? (
                  <input
                    type={type}
                    value={companyData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full border-2 border-white/30 focus:border-[#901b20]/50 rounded-2xl p-4 bg-white/20 backdrop-blur-sm focus:bg-white/30 transition-all duration-300 text-slate-700 placeholder-slate-500"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                ) : (
                  <div className="text-base text-slate-700 leading-relaxed">
                    <p className="break-words">
                      {companyData[field] || (
                        <span className="text-slate-400 italic">
                          No {label.toLowerCase()} provided
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 bg-gradient-to-r from-red-50/90 to-red-100/90 backdrop-blur-sm border border-red-200/50 text-red-800 p-6 rounded-2xl shadow-2xl animate-fade-in transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-200/80 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Error</h4>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;