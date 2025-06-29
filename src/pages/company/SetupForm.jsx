import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SetupForm = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [needBranding, setNeedBranding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanyData(response.data.data);
      } catch (error) {
        setErrorMsg("Failed to load company data");
      }
    };
    fetchCompany();
  }, [companyId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        company: {
          name: companyData.name,
          logo_path: companyData.logo_path,
          description: companyData.description,
          website: companyData.website,
          industry: companyData.industry,
          size: companyData.size,
          location: companyData.location,
          contact_email: companyData.contact_email,
          contact_phone: companyData.contact_phone,
          linkedin_url: companyData.linkedin_url
        },
        special_requirements: specialRequirements,
        need_branding: needBranding
      };

      await axios.post(`http://127.0.0.1:8000/api/job-fairs/1/participate`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg("Participation form submitted successfully!");
    } catch (error) {
      setErrorMsg("You already submitted your participation request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading company information...</p>
        </div>
      </div>
    );
  }

  const logoURL = companyData.logo_path?.startsWith('http')
    ? companyData.logo_path
    : `http://127.0.0.1:8000/storage/${companyData.logo_path}`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-red-900 rounded-2xl p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {companyData.logo_path && (
                <div className="relative w-32 h-32 rounded-3xl border-4 border-white shadow-2xl bg-white overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={logoURL}
                    alt={`${companyData.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{companyData.name}</h1>
                <div className="flex items-center space-x-3">
                  <span className="bg-red-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {companyData.industry}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Job Fair Registration</span>
            </div>
          </div>
        </div>

        {/* Company Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Email Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email Address</p>
                <p className="text-gray-900">{companyData.contact_email}</p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Phone Number</p>
                <p className="text-gray-900">{companyData.contact_phone}</p>
              </div>
            </div>
          </div>

{/* Website Card */}
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
  <div className="flex items-center space-x-4">
    <div className="bg-red-100 rounded-lg p-3">
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-600 font-medium">Website</p>
      <a
        href={companyData.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-600 hover:text-red-700 hover:underline truncate block max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {companyData.website}
      </a>
    </div>
  </div>
</div>


          {/* Location Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Office Location</p>
                <p className="text-gray-900">{companyData.location}</p>
              </div>
            </div>
          </div>

          {/* Company Size Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Company Size</p>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {companyData.size}
                </span>
              </div>
            </div>
          </div>

          {/* LinkedIn Card */}
          {companyData.linkedin_url && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">LinkedIn</p>
                  <a href={companyData.linkedin_url} target="_blank" rel="noopener noreferrer"
                     className="text-red-600 hover:text-red-700 hover:underline">
                    Company Profile
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Description Card */}
        {companyData.description && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 rounded-lg p-3 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Description</h3>
                <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Job Fair Registration Details</h2>
            <p className="text-gray-600 mt-1">Complete your participation setup for the job fair</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Special Requirements */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Special Requirements
                <span className="text-gray-500 font-normal ml-2">(Optional)</span>
              </label>
              <p className="text-sm text-gray-600">
                Let us know if you have any specific booth requirements, equipment needs, or special arrangements.
              </p>
              <textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200 resize-none"
                rows="4"
                placeholder="e.g., Power outlets, internet connection, additional tables, accessibility requirements..."
              />
            </div>

            {/* Branding Checkbox */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={needBranding}
                  onChange={(e) => setNeedBranding(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  id="branding"
                />
                <div>
                  <label htmlFor="branding" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Branding Support Required
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Check this if you need assistance with booth branding, banners, or promotional materials.
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Messages */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 text-sm font-medium">{successMsg}</p>
                </div>
              </div>
            )}
            
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm font-medium">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Submit Participation Request</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Need help? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;