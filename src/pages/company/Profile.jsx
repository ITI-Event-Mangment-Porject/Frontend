import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Edit3, Save, X, Briefcase, Mail, Phone, Globe, MapPin, Loader2
} from 'lucide-react';
import api from '../../api/axios'; 
const CompanyProfilePage = () => {
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
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rawData = response.data.data || {};
setCompanyData({
  ...rawData,
  logo_path: rawData.logo_path 
    ? rawData.logo_path.startsWith('http')
      ? rawData.logo_path
      : `http://127.0.0.1:8000/storage/${rawData.logo_path}`
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
      `http://127.0.0.1:8000/api/companies/${companyId}/logo`, // ✅ استخدمي البورت 8001
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
  logo_path: newLogoPath.replace('127.0.0.1', 'localhost')
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

  const getSizeLabel = (size) => {
    const labels = {
      small: "Small (1–50)",
      medium: "Medium (51–200)",
      large: "Large (200+)"
    };
    return labels[size] || size;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden mb-8 hover:shadow-3xl transition-all duration-500">
          {/* Header Background - Fixed gradient visibility */}
          <div className="h-40 bg-gradient-to-br from-slate-700 via-slate-800 to-red-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] animate-pulse"></div>
          </div>
          
          <div className="px-6 lg:px-12 pb-10 -mt-16 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
              
              {/* Logo Section - Fixed image display */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-red-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                {companyData.logo_path ? (
                  <div className="relative w-32 h-32 rounded-3xl border-4 border-white shadow-2xl bg-white overflow-hidden group-hover:scale-105 transition-transform duration-300">
<img 
  src={companyData.logo_path} 
  alt="Company Logo" 
  className="w-full h-full object-cover"
/>

                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center" style={{display: 'none'}}>
                      <Briefcase className="w-12 h-12 text-red-700" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-50 to-white border-4 border-white shadow-2xl rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Briefcase className="w-12 h-12 text-red-700" />
                  </div>
                )}
                {isEditing && (
                  <div className="mt-4">
                    <label 
                      htmlFor="logo-upload" 
                      className="cursor-pointer inline-block bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
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

              {/* Company Info - Fixed font visibility */}
              <div className="flex-1 text-center lg:text-left">
                {isEditing ? (
                  <input
                    value={companyData.name || ''}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl lg:text-4xl font-bold border-2 border-gray-200 focus:border-red-700 p-3 w-full rounded-2xl bg-gray-50/50 focus:bg-white transition-all duration-300 text-slate-800 placeholder-gray-500"
                    placeholder="Company Name"
                  />
                ) : (
                  <h1 className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg">
                    {companyData.name || 'Company Name'}
                  </h1>
                  
                )}
                
                <div className="mt-3">
                  {isEditing ? (
                    <input
                      value={companyData.industry || ''}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="border-2 border-gray-200 focus:border-red-700 p-2 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-300 text-slate-800 placeholder-gray-500"
                      placeholder="Industry"
                    />
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 my-5 bg-gradient-to-r from-red-700/10 to-red-700/20 text-red-700 text-sm font-semibold rounded-full border border-red-700/30 shadow-sm hover:shadow-md transition-all duration-300">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {companyData.industry || 'Industry Not Specified'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Edit3 className="w-5 h-5" /> 
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleSave} 
                      disabled={loading} 
                      className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <X className="w-5 h-5" /> 
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Email Address", field: "contact_email", icon: Mail, type: "email" },
            { label: "Phone Number", field: "contact_phone", icon: Phone, type: "tel" },
            { label: "Website", field: "website", icon: Globe, type: "url" },
            { label: "Office Location", field: "location", icon: MapPin, type: "text" },
            { label: "Company Size", field: "size", icon: Briefcase, isSelect: true }
          ].map(({ label, field, icon: Icon, isSelect, type }) => (
            <div key={field} className="group">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:border-red-700/20 transition-all duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-700/10 to-red-700/20 rounded-2xl flex items-center justify-center mr-4 group-hover:from-red-700/20 group-hover:to-red-700/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-red-700" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800">{label}</h3>
                </div>
                
                {isEditing ? (
                  isSelect ? (
                    <select
                      value={companyData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-red-700 rounded-xl p-3 bg-gray-50/50 focus:bg-white transition-all duration-300 text-slate-800"
                    >
                      <option value="">Select company size</option>
                      <option value="small">Small (1–50 employees)</option>
                      <option value="medium">Medium (51–200 employees)</option>
                      <option value="large">Large (200+ employees)</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={companyData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-red-700 rounded-xl p-3 bg-gray-50/50 focus:bg-white transition-all duration-300 text-slate-800 placeholder-gray-500"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )
                ) : (
                  <div className="text-base text-slate-800 leading-relaxed">
                    {isSelect ? (
                      <span className="inline-flex items-center px-3 py-1 bg-slate-800/10 text-slate-800 rounded-lg font-medium">
                        {getSizeLabel(companyData[field])}
                      </span>
                    ) : (
                      <p className="break-words">
                        {companyData[field] || (
                          <span className="text-gray-400 italic">
                            No {label.toLowerCase()} provided
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Company Description */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-700/10 to-red-700/20 rounded-2xl flex items-center justify-center mr-4">
              <Edit3 className="w-6 h-6 text-red-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Company Description</h2>
          </div>
          
          {isEditing ? (
            <textarea
              value={companyData.description || ''}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-red-700 rounded-xl p-4 bg-gray-50/50 focus:bg-white transition-all duration-300 text-slate-800 resize-none placeholder-gray-500"
              rows="6"
              placeholder="Write a comprehensive description about your company, its mission, values, and what makes it unique..."
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-base text-slate-800 leading-relaxed">
                {companyData.description || (
                  <span className="text-gray-400 italic">
                    No company description available. Click edit to add one.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 p-4 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center mr-3">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold">Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfilePage;