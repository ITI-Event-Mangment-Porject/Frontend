// NewJobFairModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';


const NewJobFairModal = ({ onClose }) => {
    const JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTIwODg2MDAsImV4cCI6MTc4MjA4ODYwMCwibmJmIjoxNzUyMDg4NjAwLCJqdGkiOiJ4NmFVanJnWkhYSU80QmtzIiwic3ViIjoiMTY5IiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.K-NvVcElOSANFjKLUmuceSVbhGryfdvjF07ez3Bb6-A';
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    banner_image: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8001/job-fairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWT_TOKEN}`, 
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      alert('Job Fair Created: ' + data?.data?.result?.title);
      onClose();
    } catch (err) {
      console.error('Error is',err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Job Fair</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'description', 'location'].map((field) => (
            <Input key={field} label={field} value={form[field]} onChange={handleChange(field)} />
          ))}

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={handleChange('start_date')} />
            <Input label="End Date" type="date" value={form.end_date} onChange={handleChange('end_date')} />
            <Input label="Start Time" type="time" value={form.start_time} onChange={handleChange('start_time')} />
            <Input label="End Time" type="time" value={form.end_time} onChange={handleChange('end_time')} />
          </div>

          <Input type='file'label="Banner Image URL" value={form.banner_image} onChange={handleChange('banner_image')} />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? 'Creating...' : 'Create Job Fair'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium capitalize mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none "
    />
  </div>
);

export default NewJobFairModal;
