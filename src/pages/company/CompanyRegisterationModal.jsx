import React, { useState } from 'react';
import { Shield, Building, Mail, Phone, Globe, MapPin, Users, Briefcase, Linkedin } from 'lucide-react';

const CompanyRegistrationModal = ({ show, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    linkedin_url: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages on input change
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/api/companies`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      console.log('Response:', response);

      const data = await response.json();

      if (response.ok) {
        console.log('API Response Data:', data);
        const newCompanyId = data?.data?.result?.id;
        if (newCompanyId) {
          localStorage.setItem('companyId', newCompanyId);
          setSuccessMsg('Company registered successfully!');
          setTimeout(() => {
            onSuccess(newCompanyId);
          }, 1500);
        }
      } else {
        setErrorMsg(data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Company creation failed", err);
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

   return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* 🎨 Animated Light Background Layer (fixed) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-100 via-[#c7d4d9] to-[#f2b5b8] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)] animate-pulse" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-white/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-[#f2b5b8]/30 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8 p-8">
          {/* Header */}
          <div className="relative h-64 mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] shadow-2xl">
            {/* Decorative gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
            
            {/* Floating shapes */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 bg-[#901b20]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-white/10 p-4 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
                <Building className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-white text-3xl font-bold mb-2">Company Registration</h2>
              <p className="text-white/80 text-lg">Join our platform and connect with top talent</p>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#203947]/20 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Building className="w-4 h-4 text-[#203947]" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                    placeholder="Enter company name"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#203947]" />
                    <span>Contact Email *</span>
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={form.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                    placeholder="company@example.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[#203947]" />
                    <span>Contact Phone *</span>
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={form.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#203947]" />
                    <span>Website</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    placeholder="https://company.com"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-[#203947]" />
                    <span>Industry *</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#203947]" />
                    <span>Company Size *</span>
                  </label>
                  <select
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="startup">Startup (1-10 employees)</option>
                    <option value="small">Small (11-50 employees)</option>
                    <option value="medium">Medium (51-250 employees)</option>
                    <option value="large">Large (251+ employees)</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#203947]" />
                    <span>Location *</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    required
                    placeholder="City, State, Country"
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-[#203947]" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Company Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base resize-none"
                  required
                  placeholder="Tell us about your company, its mission, and what makes it unique..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                >
                  <span>Cancel</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#901b20]/90 text-white rounded-xl font-semibold hover:from-[#901b20]/90 hover:to-[#901b20] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z" />
                      </svg>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5" />
                      <span>Register Company</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="bg-gradient-to-r from-[#203947]/10 to-[#203947]/30 border-2 border-[#203947]/50 text-[#203947]/90 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#203947]/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">{errorMsg}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationModal;