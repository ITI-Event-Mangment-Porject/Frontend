import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] w-full flex flex-col">
      {/* Navbar - takes full width at the top */}
      <Navbar />

      {/* Content area below navbar - grows to fill remaining height */}
      <div className="flex flex-1">
        {/* Sidebar - fixed width */}
        <Sidebar />

        {/* Main content area - takes remaining width */}
        <main className="flex-1">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
