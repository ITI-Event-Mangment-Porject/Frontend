const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow text-center space-y-2 transition-transform hover:scale-105">
      <div className="text-3xl">{icon}</div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
  export default StatCard;
  