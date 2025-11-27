// import React, { useState, useEffect } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { BsPersonFill, BsChevronDown, BsChevronUp } from "react-icons/bs";
// import { Collapse } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// const ClientSideNavbar = ({ isCollapsed, toggleSidebar, toggleCollapse }) => {
//   const location = useLocation();

//   const [isEmDropdownOpen, setIsEmDropdownOpen] = useState(false);
//   const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);

//   // List of all routes under the "EM Masters" dropdown
//   const emMasterRoutes = ["/jobtype"];
//   // List of all routes under the "Masters" dropdown
//   const masterRoutes = ["/bankmaster"];

//   // Automatically open the dropdown if the current route is a master route
//   useEffect(() => {
//     setIsEmDropdownOpen(emMasterRoutes.includes(location.pathname));
//     setIsMasterDropdownOpen(masterRoutes.includes(location.pathname));
//   }, [location.pathname]);

//   // Separate state for Master Entries dropdown
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Keep Master Entries dropdown in sync with route
//   useEffect(() => {
//     setIsDropdownOpen(isMasterDropdownOpen);
//   }, [isMasterDropdownOpen]);

//   return (
//     <div>
//       <div>
//         {/* Sidebar Navigation */}
//         <nav className="nav flex-column p-2">
//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Create New Request/Upload Your Work Order "}
//           </NavLink>
//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
//           >
//             {!isCollapsed && "Forward Request To Samvad "}
//           </NavLink>

//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Under Processing Request "}
//           </NavLink>

//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Accepted Request"}
//           </NavLink>

//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Published Advertisement"}
//           </NavLink>

//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "News Paper Rate List"}
//           </NavLink>

//           <NavLink
//             to="/Forward-Request"
//             className="nav-link text-white sidebar-dropdown" style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Generated Bill List / Outstanding / Payment Details"}
//           </NavLink>

//            <NavLink
//             to="/notices"
//             className="nav-link text-white sidebar-dropdown "    style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}

//           >
//             {!isCollapsed && "Notice Board"}
//           </NavLink>

//           {/* Master Entry Dropdown Header */}
//           <div
//             className="nav-link text-white d-flex justify-content-between align-items-center"
//             style={{ cursor: "pointer" ,fontSize: "13px" }}
//             onClick={() => setIsDropdownOpen((prev) => !prev)}
//           >
//             <span>
//               <BsPersonFill className="me-2"/>
//               {!isCollapsed && "Profile"}
//             </span>
//             {!isCollapsed &&
//               (isDropdownOpen ? <BsChevronUp /> : <BsChevronDown />)}
//           </div>

//           <Collapse in={isDropdownOpen}>
//             <div
//               className="ms-3 sidebar-dropdown"
//               style={{
//                 maxHeight: "100px",
//                 overflowY: "auto",
//                 scrollbarWidth: "thin",
//               }}
//             >

//               <NavLink to="/View Profile" className="nav-link text-white"style={{borderTop: "1px solid wheat"}}>
//                 {!isCollapsed && "View Profile"}
//               </NavLink>

//               <NavLink to="/Update Profile" className="nav-link text-white">
//                 {!isCollapsed && "Update Profile"}
//               </NavLink>

//               <NavLink to="/verify-mobile "className="nav-link text-white">
//                 {!isCollapsed && "Verify Mobile Number"}
//               </NavLink>
//               <NavLink to="/change-password" className="nav-link text-white">
//                 {!isCollapsed && "Change Password"}
//               </NavLink>

//             </div>
//           </Collapse>

// <NavLink to="/help" className="nav-link text-white"    style={{ fontSize: "13px", borderBottom: "1px solid wheat" ,borderTop: "1px solid wheat"}}
// >
//                 {!isCollapsed && "Help Desk"}
//               </NavLink>

//         </nav>

//       </div>

//     </div>
//   );
// };

// export default ClientSideNavbar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { BsPersonFill, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ClientSideNavbar = ({ isCollapsed }) => {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <nav className="nav flex-column p-2">
        {/* Main navigation links */}
        <NavLink
          to="/newrequest"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Dashboard"}
        </NavLink>
        <NavLink
          to="/notice"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Notice Board"}
        </NavLink>

        <NavLink
          to="/newrequest"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Create New Request / Upload Your Work Order"}
        </NavLink>
        <NavLink
          to="/newrequest"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Inbox"}
        </NavLink>

        <NavLink
          to="/newrequest"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Submited Requests"}
        </NavLink>

        <NavLink
          to="/forwardto"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Draft Request "}
        </NavLink>

        <NavLink
          to="/Forward-Request"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Under Processing Request"}
        </NavLink>

        <NavLink
          to="/Forward-Request"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Accepted Request"}
        </NavLink>

        <NavLink
          to="/Forward-Request"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Published Advertisement"}
        </NavLink>

        <NavLink
          to="/newsratelist"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Report"}
        </NavLink>

        <NavLink
          to="/newsratelist"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "Check Status"}
        </NavLink>
        <NavLink
          to="/newsratelist"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed && "News Paper Rate List"}
        </NavLink>

        <NavLink
          to="/Forward-Request"
          className="nav-link text-white sidebar-dropdown"
          style={{ fontSize: "13px", borderBottom: "1px solid wheat" }}
        >
          {!isCollapsed &&
            "Generated Bill List / Outstanding / Payment Details"}
        </NavLink>

        {/* Profile Dropdown Section */}
        {/* <div
          className="nav-link text-white d-flex justify-content-between align-items-center"
          style={{
            cursor: "pointer",
            fontSize: "13px",
            borderBottom: "1px solid wheat",
          }}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span>
            <BsPersonFill className="me-2" />
            {!isCollapsed && "Profile"}
          </span>
          {!isCollapsed &&
            (isDropdownOpen ? <BsChevronUp /> : <BsChevronDown />)}
        </div>

        <Collapse in={isDropdownOpen}>
          <div
            className="ms-3 sidebar-dropdown"
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <NavLink
              to="/view-profile"
              className="nav-link text-white"
              style={{ borderTop: "1px solid wheat" }}
            >
              {!isCollapsed && "View Profile"}
            </NavLink>

            <NavLink to="/update-profile" className="nav-link text-white">
              {!isCollapsed && "Update Profile"}
            </NavLink>

            <NavLink to="/verify-mobile" className="nav-link text-white">
              {!isCollapsed && "Verify Mobile Number"}
            </NavLink>

            <NavLink to="/change-password" className="nav-link text-white">
              {!isCollapsed && "Change Password"}
            </NavLink>
          </div>
        </Collapse> */}

        <NavLink
          to="/help"
          className="nav-link text-white sidebar-dropdown"
          style={{
            fontSize: "13px",
            borderBottom: "1px solid wheat",
            borderTop: "1px solid wheat",
          }}
        >
          {!isCollapsed && "Help Desk"}
        </NavLink>
      </nav>
    </div>
  );
};

export default ClientSideNavbar;
