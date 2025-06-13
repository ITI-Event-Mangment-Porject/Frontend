import React from "react";
import KPIBox from "@/components/company/Dashboard/KPIBox";
import InterviewStatusChart from "@/components/company/Dashboard/InterviewStatusChart";
import InterviewPerformanceChart from "@/components/company/Dashboard/InterviewPerformanceChart";
import InterviewTable from "@/components/company/Dashboard/InterviewTable";
import { FaUsers, FaClipboardCheck, FaCalendarCheck } from "react-icons/fa";

// Dummy data (replace later with real data)
const recentRequests = [
  { name: "Alice Johnson", role: "Software Engineer", fair: "Spring Tech Fair 2024", status: "Pending", date: "2024-07-28" },
  { name: "Bob Williams", role: "UX Designer", fair: "Creative Minds Expo", status: "Action Required", date: "2024-07-27" },
  { name: "Charlie Brown", role: "Data Analyst", fair: "Spring Tech Fair 2024", status: "Scheduled", date: "2024-07-26" },
];

const upcomingInterviews = [
  { name: "Grace Hopper", role: "Frontend Developer", fair: "Creative Minds Expo", status: "Scheduled", date: "2024-07-30" },
  { name: "Diana Prince", role: "Product Manager", fair: "Innovate Summit 2024", status: "Pending", date: "2024-07-31" },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
        
      {/* KPI Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIBox title="Total Requests" value="124" icon={<FaUsers />} />
        <KPIBox title="Completed Interviews" value="78" icon={<FaClipboardCheck />} bgColor="bg-[#203947]" />
        <KPIBox title="Upcoming Interviews" value="12" icon={<FaCalendarCheck />} bgColor="bg-[#ad565a]" />
      </div>


      {/* Tables - stacked vertically */}
      <InterviewTable title="Recent Requests" data={recentRequests} showActions />
      <InterviewTable title="Upcoming Interviews" data={upcomingInterviews} />



      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InterviewPerformanceChart />
        </div>
        <div>
          <InterviewStatusChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
