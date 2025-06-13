import React from "react";

const requests = [
  { id: 1, name: "Ahmed Samir", status: "Pending" },
  { id: 2, name: "Mona Khaled", status: "Accepted" },
  { id: 3, name: "Youssef Ali", status: "Rejected" },
];

const statusColor = {
  Pending: "text-yellow-600",
  Accepted: "text-green-600",
  Rejected: "text-red-600",
};

const RecentRequestsList = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold text-[#203947] mb-2">Recent Requests</h3>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li key={req.id} className="flex justify-between">
            <span>{req.name}</span>
            <span className={`${statusColor[req.status]} font-medium`}>
              {req.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentRequestsList;
