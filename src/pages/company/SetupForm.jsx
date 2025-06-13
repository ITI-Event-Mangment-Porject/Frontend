import React, { useState } from "react";

const SetupForm = () => {
  const [roles, setRoles] = useState([{ title: "", level: "", description: "", skills: "" }]);
  const [blocks, setBlocks] = useState([{ date: "", startTime: "", endTime: "", days: [] }]);

  const handleAddRole = () => setRoles([...roles, { title: "", level: "", description: "", skills: "" }]);
  const handleAddBlock = () => setBlocks([...blocks, { date: "", startTime: "", endTime: "", days: [] }]);

  const experienceLevels = ["Entry", "Mid", "Senior"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu"];

  return (
    <div className="p-6 bg-gray-100 space-y-6">
      {/* Company Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-700">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Company Name" className="input" />
          <select className="input">
            <option value="">Select Industry</option>
            <option>Tech</option>
            <option>Finance</option>
          </select>
        </div>
        <textarea placeholder="Company Overview" className="input" rows={3} />
        <textarea placeholder="Objectives at Job Fair" className="input" rows={3} />
      </div>

      {/* Roles */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-700">Job Roles & Requirements</h2>
          <button type="button" onClick={handleAddRole} className="btn">+ Add New Role</button>
        </div>
        {roles.map((role, index) => (
          <div key={index} className="border p-4 rounded-xl space-y-3">
            <input type="text" placeholder="Job Title" className="input" />
            <select className="input">
              <option value="">Experience Level</option>
              {experienceLevels.map(level => <option key={level}>{level}</option>)}
            </select>
            <textarea placeholder="Job Description" className="input" rows={2} />
            <textarea placeholder="Required Skills & Qualifications" className="input" rows={2} />
          </div>
        ))}
      </div>

      {/* Interview Schedule */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-700">Interview Schedule</h2>
          <button type="button" onClick={handleAddBlock} className="btn">+ Add Interview Block</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" placeholder="Interview Duration (minutes)" className="input" />
          <input type="number" placeholder="Break Time Between Interviews (minutes)" className="input" />
        </div>
        {blocks.map((block, index) => (
          <div key={index} className="border p-4 rounded-xl space-y-3">
            <input type="date" className="input" />
            <div className="grid grid-cols-2 gap-4">
              <input type="time" className="input" placeholder="Start Time" />
              <input type="time" className="input" placeholder="End Time" />
            </div>
            <div className="flex flex-wrap gap-2">
              {weekdays.map(day => (
                <label key={day} className="flex items-center gap-1">
                  <input type="checkbox" />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-700">Job Fair Contact Person</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Full Name" className="input" />
          <input type="tel" placeholder="Phone Number" className="input" />
          <input type="email" placeholder="Email Address" className="input" />
        </div>
      </div>

      <button className="btn w-full">Submit Form</button>
    </div>
  );
};

export default SetupForm;
