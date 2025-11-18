import React, { useState } from "react";
import {
  FiDownload,
} from "react-icons/fi";
import "../App.css";

const Sessions = () => {
  const [sessions] = useState([
    {
      user: "Siddharth",
      appId: "7W8TQUPZMFWTGXHG...",
      type: "Individual",
      sessionId: "432377961",
      station: "diodeEV 30kW DC-DNFT-ODO2001",
      StationId: "0912f698",
      NozzelId: "1",
      meterStart: "384340 Wh",
    },
    {
      user: "Rajat Kumar Rath",
      appId: "YDVQRIYAGROFYKKTU...",
      type: "Individual",
      sessionId: "665773800",
      station: "diodeEV 10kW AC-DNFT-ODO2002",
      StationId: "0912f658",
      NozzelId: "2",
      meterStart: "11943 Wh",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterChargerId, setFilterChargerId] = useState("");

  const filteredSessions = sessions.filter(
    (s) =>
      (s.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sessionId.includes(searchTerm)) &&
      (filterChargerId ? s.chargerId === filterChargerId : true)
  );

  const handleExport = () => {
    const headers = [
      "User",
      "App ID",
      "Customer Type",
      "Session ID",
      "Station",
      "Station ID",
      "Nozzel ID",
      "Meter Start",
    ];
    const rows = filteredSessions.map((s) => [
      s.user,
      s.appId,
      s.type,
      s.sessionId,
      s.station,
      s.StationId,
      s.NozzelId,
      s.meterStart,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "sessions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sessions-container">
      <h2 class="home-card-title">Sessions</h2>

      <div className="sessions-stats">
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p>{sessions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Consumption</h3>
          <p>245</p>
        </div>
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p>₹402.76</p>
        </div>
      </div>

      <div className="sessions-controls">
        <select
          className="action-btn outline"
          value={filterChargerId}
          onChange={(e) => setFilterChargerId(e.target.value)}
        >
          <option value="">All Dispension</option>
          <option value="0912f698">0912f698</option>
          <option value="e8048de1">e8048de1</option>
        </select>


        <input
          type="text"
          placeholder="Search by User or Session ID"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />


        <button className="export-btn" onClick={handleExport}>
          <FiDownload size={16} />
        </button>
      </div>


      <table className="sessions-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Customer Type</th>
            <th>Session ID</th>
            <th>Station</th>
            <th>Station ID</th>
            <th>Nozzel ID</th>
            <th>Meter Start</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((s, index) => (
            <tr key={index}>
              <td>
                <div className="user-info">
                  <span className="user-avatar">
                    {s.user.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="user-name">{s.user}</p>
                    <p className="user-app">App : {s.appId}</p>
                  </div>
                </div>
              </td>
              <td>{s.type}</td>
              <td>{s.sessionId}</td>
              <td>{s.station}</td>
              <td>{s.StationId}</td>
              <td>{s.NozzelId}</td>
              <td>{s.meterStart}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sessions;
