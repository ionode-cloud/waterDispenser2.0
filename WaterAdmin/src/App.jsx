import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Home from "./Pages/Home";
import Stations from "./Pages/Stations";
import Customers from "./Pages/Customers";
import Analytics from "./Pages/Analytics";
import Invoices from "./Pages/Invoices";
import Logs from "./Pages/Logs";
import Session from "./Pages/Session";
import Login from "./Components/Login";
import UserDetails from "./Pages/UserDetails";
import Setting from "./Pages/Setting"
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") || null;
  });

  const handleSetUser = (u) => {
    if (u) {
      localStorage.setItem("user", u);
      setUser(u);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login setUser={handleSetUser} />} />
        </Routes>
      ) : (
        <div className="container">
          <Sidebar user={user} setUser={handleSetUser} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stations" element={<Stations />} />
              <Route path="/session" element={<Session />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/user-details" element={<UserDetails />} />
              <Route path="/setting" element={< Setting />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
