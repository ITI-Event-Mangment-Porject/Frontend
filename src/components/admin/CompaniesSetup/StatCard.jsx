const StatCard = ({ title, value }) => (
  <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br from-[#901b20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <p className="text-3xl font-black text-[#901b20] animate-pulse">
        {value}
      </p>
    </div>
  </div>
);

export default StatCard;
