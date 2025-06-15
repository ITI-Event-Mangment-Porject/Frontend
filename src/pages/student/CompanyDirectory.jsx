import React, { useState, useMemo } from 'react';
import Navbar from '../../components/student/Navbar';
import Sidebar from '../../components/student/Sidebar';
import Footer from '../../components/student/Footer';

const companies = [
  {
    id: 1,
    name: 'Tech Innovations Inc.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '200-500 Employees',
    logo: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
    email: 'contact@techinnovationsinc.com',
    phone: '+1 (234) 123-4567',
    website: 'www.techinnovationsinc.com',
    hiring: true,
    overview:
      'Tech Innovations Inc. is a pioneering software company dedicated to developing cutting-edge solutions that transform businesses globally.',
    culture:
      'We foster a collaborative and inclusive environment where every voice is heard.',
    roles: [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
    ],
  },
  {
    id: 2,
    name: 'GreenFuture Energy',
    industry: 'Renewable Energy',
    location: 'Austin, TX',
    size: '100-250 Employees',
    logo: 'https://cdn-icons-png.flaticon.com/512/2201/2201570.png',
    email: 'info@greenfuture.com',
    phone: '+1 (512) 555-9876',
    website: 'www.greenfuture.com',
    hiring: true,
    overview:
      'GreenFuture Energy provides clean energy solutions including solar panels and smart grid systems.',
    culture:
      'Our company prioritizes eco-conscious values, offering flexible schedules and remote options.',
    roles: [
      'Electrical Engineer',
      'Sustainability Analyst',
      'Sales Manager',
      'Project Coordinator',
    ],
  },
  {
    id: 3,
    name: 'MediBridge HealthTech',
    industry: 'Healthcare Technology',
    location: 'New York, NY',
    size: '500-1000 Employees',
    logo: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
    email: 'careers@medibridge.com',
    phone: '+1 (212) 456-7890',
    website: 'www.medibridge.com',
    hiring: false,
    overview:
      'MediBridge develops digital health platforms connecting patients and healthcare providers.',
    culture:
      'Our team thrives in a fast-paced, mission-driven environment with hybrid work support.',
    roles: [
      'Backend Developer',
      'Clinical Data Analyst',
      'Technical Writer',
      'Product Designer',
    ],
  },
  {
    id: 4,
    name: 'FinCore Analytics',
    industry: 'Finance & Data Analytics',
    location: 'Chicago, IL',
    size: '50-200 Employees',
    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
    email: 'jobs@fincoreanalytics.com',
    phone: '+1 (312) 321-5555',
    website: 'www.fincoreanalytics.com',
    hiring: true,
    overview:
      'FinCore provides predictive analytics and financial modeling solutions to help investors.',
    culture:
      'We foster a growth-minded culture with open communication and mentorship programs.',
    roles: [
      'Quantitative Analyst',
      'ML Engineer',
      'Financial Developer',
      'Risk Consultant',
    ],
  },
];

const CompanyDirectory = () => {
  const [selected, setSelected] = useState(0);
  const [filters, setFilters] = useState({
    industry: 'All',
    size: 'All',
    hiring: 'All',
  });

  const filtered = useMemo(() => {
    return companies.filter(c => {
      return (
        (filters.industry === 'All' || c.industry === filters.industry) &&
        (filters.size === 'All' || c.size.includes(filters.size)) &&
        (filters.hiring === 'All' || (filters.hiring === 'Hiring') === c.hiring)
      );
    });
  }, [filters]);

  const company = filtered[selected] || companies[0];

  return (
    <div className="bg-gray-50 w-375 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 p-4 gap-6">
          {/* Sidebar */}
          <div className="w-96 space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">
                Filters ({filtered.length})
              </h3>
              <div className="space-y-2">
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filters.industry}
                  onChange={e =>
                    setFilters(f => ({ ...f, industry: e.target.value }))
                  }
                >
                  <option value="All">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Healthcare Technology">Healthcare</option>
                  <option value="Finance & Data Analytics">Finance</option>
                </select>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filters.size}
                  onChange={e =>
                    setFilters(f => ({ ...f, size: e.target.value }))
                  }
                >
                  <option value="All">All Sizes</option>
                  <option value="50">1-200</option>
                  <option value="200">200-500</option>
                  <option value="500">500+</option>
                </select>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={filters.hiring}
                  onChange={e =>
                    setFilters(f => ({ ...f, hiring: e.target.value }))
                  }
                >
                  <option value="All">All Status</option>
                  <option value="Hiring">Hiring</option>
                  <option value="Not Hiring">Not Hiring</option>
                </select>
              </div>
              <button
                className="w-full mt-3 text-sm border-2 border-dashed border-gray-300 rounded-lg py-2 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-gray-600 font-medium"
                onClick={() =>
                  setFilters({ industry: 'All', size: 'All', hiring: 'All' })
                }
              >
                🗑️ Clear All Filters
              </button>
            </div>

            {/* Companies List */}
            <div className="bg-white rounded-lg shadow divide-y">
              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-orange-50 ${
                    selected === i
                      ? 'border-l-4 border-orange-500 bg-orange-50'
                      : ''
                  }`}
                  onClick={() => setSelected(i)}
                >
                  <img src={c.logo} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-500">
                      {c.industry} · {c.location}
                    </div>
                  </div>
                  <button
                    className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all duration-200 ${
                      c.hiring
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-500 border-gray-300'
                    }`}
                  >
                    {c.hiring ? 'Apply Now' : 'Not Hiring'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <div className="flex gap-4 items-center mb-4">
              <img src={company.logo} alt="" className="w-20 h-20 rounded-lg" />
              <div>
                <h1 className="font-bold text-2xl">{company.name}</h1>
                <p className="text-sm text-gray-500">
                  {company.industry} · {company.size}
                </p>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>{company.email}</span>
                  <span>{company.phone}</span>
                  <span>{company.website}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Overview</h4>
                <p className="text-sm text-gray-600">{company.overview}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Culture</h4>
                <p className="text-sm text-gray-600">{company.culture}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  🎯 Available Positions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {company.roles.map(role => (
                    <div
                      key={role}
                      className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border-2 border-gray-300 px-6 py-3 rounded-xl text-center font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                >
                  🌐 Visit Website
                </a>
                <button
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    company.hiring
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {company.hiring ? '🚀 Apply Now' : '❌ Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyDirectory;
