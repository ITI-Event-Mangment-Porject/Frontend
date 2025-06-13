import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Building, Phone, Mail, Globe } from 'lucide-react';

export default function SetupForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyAddress: '',
    businessSummary: '',
    jobTitle: '',
    jobType: '',
    experienceLevel: '',
    jobDescription: '',
    requiredSkills: '',
    interviewSlots: '',
    interviewFormat: '',
    contactPerson: '',
    email: '',
    phoneNumber: ''
  });

  const [interviewDates, setInterviewDates] = useState([
    { date: '', startTime: '', endTime: '' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (index, field, value) => {
    const newDates = [...interviewDates];
    newDates[index][field] = value;
    setInterviewDates(newDates);
  };

  const addDateSlot = () => {
    setInterviewDates([...interviewDates, { date: '', startTime: '', endTime: '' }]);
  };

  const removeDateSlot = (index) => {
    if (interviewDates.length > 1) {
      setInterviewDates(interviewDates.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, interviewDates });
    alert('Form submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#a72b2b] text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6" />
            Job Fair Participation Setup
          </h1>
          <p className="mt-2 text-red-100">Complete this form to register your company for the upcoming job fair</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Company Information */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#a72b2b]" />
              Company Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology & Software Development</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                placeholder="Enter full company address"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Summary (Brief description)</label>
              <textarea
                name="businessSummary"
                value={formData.businessSummary}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                placeholder="Provide a brief description of your company's activities and goals..."
              ></textarea>
            </div>
          </section>

          {/* Job Roles & Requirements */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a72b2b]" />
              Job Roles & Requirements
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                  placeholder="e.g. Software Engineer, Marketing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                >
                  <option value="">Select Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
              >
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
                <option value="executive">Executive Level</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                placeholder="Detailed job description including responsibilities, requirements, and benefits..."
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills & Qualifications</label>
              <textarea
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                placeholder="List required skills, qualifications, certifications, etc."
              ></textarea>
            </div>
          </section>

          {/* Interview Slots & Schedule */}
          <section className="border-b pb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#a72b2b]" />
              Interview Slots & Schedule
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Interview Method</label>
              <select
                name="interviewFormat"
                value={formData.interviewFormat}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
              >
                <option value="">Select Interview Format</option>
                <option value="in-person">In-Person Interview</option>
                <option value="virtual">Virtual Interview</option>
                <option value="hybrid">Hybrid (Both Options)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Interview Dates & Times</label>
            </div>

            {interviewDates.map((slot, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                    />
                  </div>
                  <div>
                    {interviewDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDateSlot(index)}
                        className="px-3 py-2 text-[#a72b2b] hover:bg-red-50 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addDateSlot}
              className="flex items-center gap-2 px-4 py-2 text-[#a72b2b] border border-[#a72b2b] rounded-lg hover:bg-red-50 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Add Another Time Slot
            </button>
          </section>

          {/* Contact Person */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#a72b2b]" />
              Job Fair Contact Person
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                  placeholder="Contact person's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72b2b] focus:border-[#a72b2b]"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-8 border-t">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-[#a72b2b] text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Building className="w-5 h-5" />
              Submit Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}