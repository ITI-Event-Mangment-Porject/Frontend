import React from "react";
import KPIBox from "@/components/company/Dashboard/KPIBox";
import InterviewStatusChart from "@/components/company/Dashboard/InterviewStatusChart";
import InterviewPerformanceChart from "@/components/company/Dashboard/InterviewPerformanceChart";
import RecentRequestsList from "@/components/company/Dashboard/RecentRequestsList";
import UpcomingSchedule from "@/components/company/Dashboard/UpcomingSchedule";

import { FaUsers, FaClipboardCheck, FaCalendarCheck } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPIBox title="Total Requests" value="124" icon={<FaUsers />} />
        <KPIBox title="Completed Interviews" value="78" icon={<FaClipboardCheck />} bgColor="bg-[#203947]" />
        <KPIBox title="Upcoming Interviews" value="12" icon={<FaCalendarCheck />} bgColor="bg-[#ad565a]" />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InterviewPerformanceChart />
        </div>
        <div>
          <InterviewStatusChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentRequestsList />
        <UpcomingSchedule />
      </div>
    </div>
  );
};

export default Dashboard;
