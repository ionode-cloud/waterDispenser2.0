import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../App.css";

// Function to get current formatted date-time
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString(); // Example: "9/19/2025, 10:32:45 AM"
};

const initialCustomers = [
  {
    id: 1,
    name: "Aaa",
    email: "a@gmail.com",
    phone: "+919119292600",
    sessions: 5,
    dateTime: getCurrentDateTime(),
  },
  {
    id: 2,
    name: "Jj",
    email: "j@gmail.com",
    phone: "+919776833939",
    sessions: 1,
    dateTime: getCurrentDateTime(),
  },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm)
  );

  return (
    <div className="customers-container">
      <h2 class="home-card-title">Customers</h2>
      <div className="customers-header">
        <span>Total Customers: {filteredCustomers.length}</span>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name, email or phone number"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch className="search-icon" />
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>Name</div>
          <div>User Type</div>
          <div>Email</div>
          <div>Phone</div>
          <div>No. of Sessions</div>
          <div>Date & Time</div>
        </div>
        <div className="table-body">
          {filteredCustomers.map((cust) => (
            <div className="table-row" key={cust.id}>
              <div className="name-cell">{cust.name}</div>
              <div className="user-type">Water</div>
              <div>{cust.email}</div>
              <div>{cust.phone}</div>
              <div>{cust.sessions}</div>
              <div>{cust.dateTime}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
