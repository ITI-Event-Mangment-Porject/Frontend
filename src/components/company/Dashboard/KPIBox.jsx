import React from "react";

const KPIBox = ({ title, value, icon, bgColor = "bg-[#901b20]" }) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 text-white ${bgColor} flex items-center justify-between`}>
      <div>
        <h4 className="text-sm font-medium text-[#ebebeb]">{title}</h4>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
};

export default KPIBox;
