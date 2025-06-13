import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const InterviewPerformanceChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Interviews Done",
        data: [5, 8, 6, 4, 7],
        backgroundColor: "#203947",
        borderRadius: 8, // Optional: Rounded bar edges
      },
    ],
  };

  return (
    <div
      className="
        bg-white rounded-2xl p-4 shadow-md 
        hover:shadow-lg hover:scale-[1.02] transition-all duration-300 
        cursor-pointer
      "
    >
      <h3 className="font-semibold text-[#203947] mb-2">
        Weekly Interview Performance
      </h3>
      <Bar data={data} />
    </div>
  );
};

export default InterviewPerformanceChart;
