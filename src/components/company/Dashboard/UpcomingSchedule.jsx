import React from "react";

const upcoming = [
  { time: "10:00 AM", name: "Salma Mohamed", position: "Frontend Dev" },
  { time: "11:30 AM", name: "Hassan Fathy", position: "Backend Dev" },
  { time: "1:00 PM", name: "Rania Adel", position: "UI/UX" },
];

const UpcomingSchedule = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold text-[#203947] mb-2">Upcoming Interviews</h3>
      <ul className="space-y-3">
        {upcoming.map((u, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">{u.position}</p>
            </div>
            <span className="text-sm text-[#901b20] font-semibold">{u.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingSchedule;
