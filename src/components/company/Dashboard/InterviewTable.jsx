import React, { useState, useRef, useEffect } from "react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Scheduled: "bg-green-100 text-green-800",
  "Action Required": "bg-red-100 text-red-800",
  Rescheduled: "bg-blue-100 text-blue-800",
};

const InterviewTable = ({ title, data, showActions = false }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="
        bg-white rounded-2xl shadow-md p-4 
        hover:shadow-lg hover:scale-[1.01] transition-all duration-300
      "
    >
      <h2 className="text-lg font-semibold mb-4 text-[#203947]">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr className="text-gray-600">
              <th className="py-2 px-3">Candidate</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Job Fair</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Requested On</th>
              {showActions && <th className="py-2 px-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((interview, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-2 px-3">{interview.name}</td>
                <td className="py-2 px-3">{interview.role}</td>
                <td className="py-2 px-3">{interview.fair}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusStyles[interview.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {interview.status}
                  </span>
                </td>
                <td className="py-2 px-3">{interview.date}</td>

                {showActions && (
                  <td className="py-2 px-3 relative" ref={menuRef}>
                    <button
                      onClick={() =>
                        setOpenMenuIndex(openMenuIndex === idx ? null : idx)
                      }
                      className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
                      aria-label="More options"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>

                    {openMenuIndex === idx && (
                      <div
                        className="
                          absolute right-0 mt-2 w-44 bg-white border border-gray-200 
                          rounded-md shadow-lg z-20 animate-fade-in
                        "
                      >
                        <button className="flex items-center gap-2 px-4 py-2 w-full text-sm text-green-700 hover:bg-gray-100 transition">
                          View
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 w-full text-sm text-blue-600 hover:bg-blue-50 transition">
                          Reschedule
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition">
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewTable;
