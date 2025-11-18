import React, { useState } from "react";
import {
  FiFilter,
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

const initialLogs = [
  {
    requestTime: "05 Sept 2025, 05:07:08.046 pm",
    responseTime: "05 Sept 2025, 05:07:08.132 pm",
    transactionId: "665773800",
    chargerId: "e8048de1",
    events: "MeterValues",
    message: "Failed to accept metervalues",
  },
  {
    requestTime: "05 Sept 2025, 05:02:30.681 pm",
    responseTime: "05 Sept 2025, 05:02:30.712 pm",
    transactionId: "-",
    chargerId: "0912f698",
    events: "Heartbeat",
    message: "Heartbeat received from charger",
  },
];

const Logs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterLogs(value, selectedDate);
  };

  const handleRefresh = () => {
    setSearch("");
    setSelectedDate(null);
    setLogs(initialLogs);
  };

  const handleDownload = () => {
    const data = logs.map((item) => ({
      "Request Time": item.requestTime,
      "Response Time": item.responseTime,
      "Transaction ID": item.transactionId,
      "Charger ID": item.chargerId,
      Events: item.events,
      Message: item.message,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.csv";
    a.click();
  };

  const filterLogs = (searchValue, date) => {
    let filtered = [...initialLogs];

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.transactionId.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.chargerId.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.events.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.message.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (date) {
      const selected = date.toISOString().split("T")[0];
      filtered = filtered.filter((item) =>
        item.requestTime.includes(selected) || item.responseTime.includes(selected)
      );
    }

    setLogs(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterLogs(search, date);
  };

  const totalLogs = logs.length;

  return (
    <div className="log-container">
      <span>
        Total Logs: <strong>{totalLogs}</strong>
      </span>
      <h2  class="home-card-title">Logs</h2>
      <div className="action-bar">
        <button className="action-btn outline">
          <FiFilter size={16} />
          <span>Filters</span>
        </button>

        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          className="datepicker-input"
        />

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
          <FiSearch className="search-icon" />
        </div>

        <button className="action-btn filled" onClick={handleRefresh}>
          <FiRefreshCw size={16} />
        </button>

        <button className="action-btn outline" onClick={handleDownload}>
          <FiDownload size={16} />
        </button>
      </div>

      <div className="log-table">
        <div className="log-table-header">
          <div>Request Time</div>
          <div>Response Time</div>
          <div>Transaction ID</div>
          <div>Charger ID</div>
          <div>Events</div>
          <div>Message</div>
        </div>

        {logs.map((item, index) => (
          <div
            className={`log-table-row ${item.message.includes("Failed") ? "log-error" : "log-success"}`}
            key={index}
          >
            <div>{item.requestTime}</div>
            <div>{item.responseTime}</div>
            <div>{item.transactionId}</div>
            <div>{item.chargerId}</div>
            <div>{item.events}</div>
            <div>{item.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
