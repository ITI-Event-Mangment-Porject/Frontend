import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Building, Phone, Mail, Globe, Plus, X, Check } from 'lucide-react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', { ...formData, interviewDates });
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Animated Header */}
        <div className="bg-gradient-to-r from-[#a72b2b] via-red-700 to-[#8b2323] text-white rounded-t-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-300 to-pink-400"></div>
          
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-fade-in">
                  Job Fair Participation Setup
                </h1>
                <p className="text-red-100 text-sm sm:text-base opacity-90">
                  Complete this form to register your company for the upcoming job fair
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8 sm:space-y-12">
            
            {/* Company Information */}
            <section className="group">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 border-b-2 border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                  <Building className="w-6 h-6 text-[#a72b2b]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Company Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
                
                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    required
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

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Company Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover/input:text-[#a72b2b] transition-colors" />
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Enter full company address"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Business Summary
                </label>
                <textarea
                  name="businessSummary"
                  value={formData.businessSummary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Provide a brief description of your company's activities and goals..."
                ></textarea>
              </div>
            </section>

            {/* Job Roles & Requirements */}
            <section className="group">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 border-b-2 border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                  <Users className="w-6 h-6 text-[#a72b2b]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Job Roles & Requirements</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="e.g. Software Engineer, Marketing Manager"
                    required
                  />
                </div>

                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Employment Type *
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    required
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

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Experience Level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Detailed job description including responsibilities, requirements, and benefits..."
                  required
                ></textarea>
              </div>

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Required Skills & Qualifications
                </label>
                <textarea
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                  placeholder="List required skills, qualifications, certifications, etc."
                ></textarea>
              </div>
            </section>

            {/* Interview Slots & Schedule */}
            <section className="group">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 border-b-2 border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                  <Calendar className="w-6 h-6 text-[#a72b2b]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Interview Slots & Schedule</h2>
              </div>

              <div className="mb-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Preferred Interview Method *
                </label>
                <select
                  name="interviewFormat"
                  value={formData.interviewFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Interview Format</option>
                  <option value="in-person">In-Person Interview</option>
                  <option value="virtual">Virtual Interview</option>
                  <option value="hybrid">Hybrid (Both Options)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Available Interview Dates & Times</label>
              </div>

              <div className="space-y-4">
                {interviewDates.map((slot, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-red-50 p-4 sm:p-6 rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      <div className="group/input">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-white"
                          required
                        />
                      </div>
                      <div className="group/input">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-white"
                          required
                        />
                      </div>
                      <div className="group/input">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                          End Time *
                        </label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-white"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        {interviewDates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDateSlot(index)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 border border-red-300 hover:border-red-500 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addDateSlot}
                className="flex items-center gap-2 px-6 py-3 mt-4 text-[#a72b2b] border-2 border-[#a72b2b] rounded-xl hover:bg-[#a72b2b] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Another Time Slot
              </button>
            </section>

            {/* Contact Person */}
            <section className="group">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-3 border-b-2 border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-[#a72b2b]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Job Fair Contact Person</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Contact person's full name"
                    required
                  />
                </div>

                <div className="group/input">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover/input:text-[#a72b2b] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 group/input">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover/input:text-[#a72b2b] transition-colors">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover/input:text-[#a72b2b] transition-colors" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-[#a72b2b] hover:border-red-300 transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 ${
                  submitted 
                    ? 'bg-green-500 text-white' 
                    : isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#a72b2b] via-red-700 to-[#8b2323] text-white hover:from-red-800 hover:via-red-900 hover:to-red-800'
                }`}
              >
                {submitted ? (
                  <>
                    <Check className="w-6 h-6" />
                    Registration Submitted Successfully!
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <Building className="w-6 h-6" />
                    Submit Registration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}