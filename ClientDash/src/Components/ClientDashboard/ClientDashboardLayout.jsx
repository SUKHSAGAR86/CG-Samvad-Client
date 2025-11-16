
import React, { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import ClientSideNav from "./ClientSideNav"
import ClientHeader from "./ClientHeader"
import ClientFooter from "./ClientFooter"
import CreateNewRequest from "./CreateNewRequest/Createnewrequest"
// import noiticeBoard from "./ClientNoticeBoard/ClientNoticeBoard"

const ClientDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Handle sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Run once on mount

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className=" contaoiner-fluid d-flex flex-column flex-lg-row  min-vh-100 " >
      {/* Sidebar */}
      <div
        className={` text-white position-fixed top-0 start-0 h-100 z-3 transition ${
          sidebarOpen ? "" : "d-none"
        } d-lg-block`}
        style={{ width: "250px" }}
      >
        <ClientSideNav />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-2"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen && window.innerWidth >= 992 ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <ClientHeader toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-grow-1 p-3 mt-3 mt-lg-0 bg-danger-subtle">
          {/* <Outlet /> */}
          
        </main>

        {/* Footer */}
        <ClientFooter />
      </div>
    </div>
  )
}

export default ClientDashboardLayout

