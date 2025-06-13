import React from "react";

const KPIBox = ({ title, value, icon, bgColor = "bg-[#901b20]" }) => {
  return (
    <div
      className={`
        rounded-2xl shadow-md p-4 text-white 
        ${bgColor} flex items-center justify-between 
        transition-transform duration-300 ease-in-out 
        hover:scale-105 hover:shadow-lg hover:brightness-110 cursor-pointer
      `}
    >
      <div>
        <h4 className="text-sm font-medium text-[#ebebeb]">{title}</h4>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
};

export default KPIBox;
