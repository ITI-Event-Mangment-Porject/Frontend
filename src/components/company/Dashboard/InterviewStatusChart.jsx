import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const InterviewStatusChart = () => {
  const data = {
    labels: ["Accepted", "Rejected", "Pending"],
    datasets: [
      {
        label: "Interview Status",
        data: [12, 5, 8],
        backgroundColor: ["#901b20", "#ad565a", "#cc9598"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold text-[#203947] mb-2">Interview Status</h3>
      <Doughnut data={data} />
    </div>
  );
};

export default InterviewStatusChart;
