"use client"
import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-[#ebebeb] w-full">
      {/* Fixed Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} onLogout={onLogout} />

      {/* Fixed Sidebar with proper spacing */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content wrapper with dynamic responsive margins based on sidebar state */}
      <div
        className={`transition-all duration-300 ease-in-out pt-16 sm:pt-18 lg:pt-20  ${
          // Dynamic margin based on sidebar state for desktop only
          isCollapsed ? "lg:ml-16 xl:ml-20" : "lg:ml-64 xl:ml-72"
        }`}
      >
        {/* Main content area - aligned with sidebar */}
        <main className="flex-1">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay - Fixed z-index issue */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
