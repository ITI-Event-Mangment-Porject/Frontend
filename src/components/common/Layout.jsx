import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] w-full">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content wrapper with margins to account for fixed navbar and sidebar */}
      <div className="ml-14 sm:ml-20 md:ml-20 lg:ml-60 mt-16 transition-all duration-300 ease-in-out">
        {/* Main content area */}
        <main className="flex-1">
          <div className="p-2">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
