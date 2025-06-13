import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col ">
      <Topbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto ml-64 my-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
