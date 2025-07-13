'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const NewJobFairModal = ({ onClose }) => {
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


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = field => e => {
    const value = field === 'banner_image' ? e.target.files[0] : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      'title',
      'start_date',
      'end_date',
      'start_time',
      'end_time',
    ];

    requiredFields.forEach(field => {
      if (!form[field]) newErrors[field] = 'This field is required.';
    });

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.start_date) > new Date(form.end_date)
    ) {
      newErrors.end_date = 'End date must be after or equal to start date.';
    }

    if (
      form.start_date === form.end_date &&
      form.start_time &&
      form.end_time &&
      form.start_time >= form.end_time
    ) {
      newErrors.end_time = 'End time must be after start time on the same day.';
    }

    if (
      form.banner_image &&
      !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
        form.banner_image.type
      )
    ) {
      newErrors.banner_image = 'Only JPG, PNG, and WEBP images are allowed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      // const res = await fetch('http://127.0.0.1:8000/job-fairs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${JWT_TOKEN}`,
      //   },
      //   body: JSON.stringify(form),
      // });

      // Generate slug from title
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      formData.append('title', form.title);
      formData.append('slug', slug);
      formData.append('description', form.description || '');
      formData.append('location', form.location || '');
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);
      formData.append('start_time', form.start_time);
      formData.append('end_time', form.end_time);
      formData.append('type', 'Job Fair');
      formData.append('visibility_type', 'all');

      if (form.banner_image) {
        formData.append('banner_image', form.banner_image);
      }

      // Mock API call - replace with actual API
      console.log('Creating job fair with data:', Object.fromEntries(formData));
      alert('Job Fair Created: ' + form.title);
      onClose();
    } catch (err) {
      console.error('Error is', err);
      alert('Failed to create job fair');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Job Fair</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            error={errors.title}
          />

          <Input
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            error={errors.description}
          />

          <Input
            label="Location"
            value={form.location}
            onChange={handleChange('location')}
            error={errors.location}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={handleChange('start_date')}
              error={errors.start_date}
            />
            <Input
              label="End Date"
              type="date"
              value={form.end_date}
              onChange={handleChange('end_date')}
              error={errors.end_date}
            />
            <Input
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={handleChange('start_time')}
              error={errors.start_time}
            />
            <Input
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={handleChange('end_time')}
              error={errors.end_time}
            />
          </div>

          <Input
            type="file"
            label="Banner Image"
            onChange={handleChange('banner_image')}
            error={errors.banner_image}
          />
          {form.banner_image && typeof form.banner_image !== 'string' && (
            <p className="text-sm text-gray-600 mt-1">
              Selected file: {form.banner_image.name}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-(--primary-500) text-white rounded hover:bg-(--primary-600) cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Job Fair'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, error, type = 'text', ...props }) => (
  <div>
    <label className="block text-sm font-medium capitalize mb-1">{label}</label>
    {type === 'file' ? (
      <input
        type="file"
        {...props}
        className={`block w-full text-sm text-gray-900 border rounded cursor-pointer ${
          error ? 'border-red-500' : 'border-gray-300'
        } file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100`}
      />
    ) : (
      <input
        type={type}
        {...props}
        className={`w-full px-3 py-2 border rounded focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default NewJobFairModal;
