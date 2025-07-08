import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* 🎨 Animated Light Background Layer (fixed) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-100 via-[#c7d4d9] to-[#f2b5b8] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)] animate-pulse" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-white/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-[#f2b5b8]/30 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* 📦 Main Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Topbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6 overflow-y-auto ml-64 my-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
