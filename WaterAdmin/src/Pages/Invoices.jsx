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

const initialInvoices = [
  {
    id: "IONCS-20250905-GF8STN",
    date: "2025-09-05",
    customer: "Tapas Rath",
    sessionCost: 328.79,
    kWh: 16.39,
    platformFee: 16.45,
    settlement: 312.33,
    type: "Prepaid",
    status: "Paid",
  },
  {
    id: "IONCS-20250905-FUQOOV",
    date: "2025-09-05",
    customer: "Siddharth",
    sessionCost: 284.86,
    kWh: 14.2,
    platformFee: 14.25,
    settlement: 270.61,
    type: "Prepaid",
    status: "Pending",
  },
];

const Invoice = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterInvoices(value, selectedDate);
  };

  const handleRefresh = () => {
    setSearch("");
    setSelectedDate(null);
    setInvoices(initialInvoices);
  };

  const handleDownloadAll = () => {
    if (invoices.length === 0) return;

    const data = invoices.map((item) => ({
      InvoiceID: item.id,
      Date: item.date,
      Customer: item.customer,
      SessionCost: item.sessionCost,
      kWh: item.kWh,
      PlatformFee: item.platformFee,
      SettlementAmount: item.settlement,
      Type: item.type,
      Status: item.status,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
  };

  const handleDownloadRow = (invoice) => {
    const data = {
      InvoiceID: invoice.id,
      Date: invoice.date,
      Customer: invoice.customer,
      SessionCost: invoice.sessionCost,
      kWh: invoice.kWh,
      PlatformFee: invoice.platformFee,
      SettlementAmount: invoice.settlement,
      Type: invoice.type,
      Status: invoice.status,
    };

    const csv =
      Object.keys(data).join(",") + "\n" + Object.values(data).join(",");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.csv`;
    a.click();
  };

  const filterInvoices = (searchValue, date) => {
    let filtered = [...initialInvoices];

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.id.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      filtered = filtered.filter((item) => item.date === formattedDate);
    }

    setInvoices(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterInvoices(search, date);
  };

  return (
    <div className="invoice-container">
      <h2 class="home-card-title">Invoice</h2>
      <div className="summary-header">
        <span>
          Pending Settlements:{" "}
          <strong>
            ₹
            {invoices
              .reduce((total, item) => total + item.settlement, 0)
              .toFixed(2)}
          </strong>
        </span>
        <span>
          Pending Payment: <strong>₹0.00</strong>
        </span>
      </div>

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

        <button className="action-btn outline" onClick={handleDownloadAll}>
          <FiDownload size={16} />
        </button>
      </div>

      <div className="invoice-table">
        <div className="table-header">
          <div>Invoice ID</div>
          <div>Date</div>
          <div>Customer</div>
          <div>Session Cost</div>
          <div>kWh</div>
          <div>Platform Fee</div>
          <div>Settlement</div>
          <div>Type</div>
          <div>Status</div>
          <div>Download</div>
        </div>

        {invoices.map((item) => (
          <div className="table-row" key={item.id}>
            <div>{item.id}</div>
            <div>{item.date}</div>
            <div>{item.customer}</div>
            <div>₹{item.sessionCost}</div>
            <div>{item.kWh} kWh</div>
            <div>₹{item.platformFee}</div>
            <div>₹{item.settlement}</div>
            <div>{item.type}</div>
            <div
              style={{
                color: item.status === "Paid" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {item.status}
            </div>
            <div>
              <button
                className="action-btn outline"
                onClick={() => handleDownloadRow(item)}
              >
                <FiDownload size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoice;
