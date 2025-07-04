const Filters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSearch,
  onRefresh,
}) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <form onSubmit={onSearch} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
        </div>
      </form>
      <div className="flex items-center gap-4">
        <select
          className="border rounded-lg px-3 py-2 focus:outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={onRefresh}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  </div>
);
export default Filters;
