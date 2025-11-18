import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaUserClock,
  FaUsers,
  FaChartBar,
  FaFileInvoice,
  FaClipboardList,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "../App.css";
import logo from "../Components/logo (2).png";

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) setUserInitial(user.charAt(0).toUpperCase());
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo">
        <img src={logo} height="40" width="60" alt="logo" />
        {!collapsed && <span>Water Dispension</span>}
      </div>

      <ul className="menu">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaHome /> {!collapsed && <span>Home</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/stations" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaMapMarkerAlt /> {!collapsed && <span>Stations</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaChartBar /> {!collapsed && <span>Analytics</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/session" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUserClock /> {!collapsed && <span>Session</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUsers /> {!collapsed && <span>Customers</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/invoices" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaFileInvoice /> {!collapsed && <span>Invoices</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/logs" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaClipboardList /> {!collapsed && <span>Logs</span>}
          </NavLink>
        </li>
      </ul>

      <div className="bottom-section">
        {userInitial && (
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="user-circle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {userInitial}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu" style={{ backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.2)" }}>
                <button onClick={() => navigate("/setting")}>Settings</button>
                <button onClick={() => navigate("/user-details")}>User Details</button>
                <button
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
