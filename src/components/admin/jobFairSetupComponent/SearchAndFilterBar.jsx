'use client';
import { Search } from 'lucide-react';

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search companies by name, industry, or location..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <select
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
      >
        <option>All Statuses</option>
        <option>Approved</option>
        <option>Pending</option>
        <option>Rejected</option>
      </select>
    </div>
  );
};

export default SearchAndFilterBar;
