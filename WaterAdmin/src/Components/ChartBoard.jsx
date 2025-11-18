import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 400, utilization: 300, consumption: 80, sessions: 20 },
  { name: "Feb", revenue: 350, utilization: 280, consumption: 75, sessions: 18 },
  { name: "Mar", revenue: 500, utilization: 320, consumption: 90, sessions: 25 },
  { name: "Apr", revenue: 450, utilization: 310, consumption: 85, sessions: 22 },
  { name: "May", revenue: 600, utilization: 350, consumption: 95, sessions: 28 },
  { name: "Jun", revenue: 480, utilization: 330, consumption: 88, sessions: 24 },
  { name: "Jul", revenue: 550, utilization: 340, consumption: 92, sessions: 26 },
  { name: "Aug", revenue: 620, utilization: 360, consumption: 100, sessions: 30 },
  { name: "Sep", revenue: 580, utilization: 345, consumption: 97, sessions: 27 },
  { name: "Oct", revenue: 610, utilization: 355, consumption: 99, sessions: 29 },
  { name: "Nov", revenue: 570, utilization: 340, consumption: 94, sessions: 25 },
  { name: "Dec", revenue: 650, utilization: 370, consumption: 105, sessions: 32 },
];

const metrics = [
  { title: "Revenue", value: "₹76.4", change: "-69.98%", color: "red", key: "revenue" },
  { title: "Utilization", value: "47.99%", change: "309%", color: "green", key: "utilization" },
  { title: "Consumption", value: "5.46 kWh", change: "-64.61%", color: "red", key: "consumption" },
  { title: "Sessions", value: "4", change: "33.3%", color: "green", key: "sessions" },
];

const styles = {
  dashboard: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  filterButtons: { display: "flex", gap: "10px", marginBottom: "20px" },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #8884d8",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#8884d8",
    background: "white",
    cursor: "pointer",
  },
  metrics: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    gap: "10px",
    marginBottom: "30px",
  },
  card: (isActive) => ({
    borderRadius: "8px",
    padding: "10px 12px",
    width: "22%",
    minWidth: "120px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: isActive ? "#f3f0ff" : "#fff",
  }),
  cardTitle: { margin: 0, fontSize: "14px", color: "#555" },
  cardValue: { fontSize: "14px", fontWeight: "bold", margin: "4px 0" },
  cardChange: { fontSize: "13px" },
  chartContainer: { borderRadius: "8px", padding: "20px" },
};

function ChartBoard() {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const chartData =
    selectedMonth === "All"
      ? monthlyData
      : monthlyData.filter((item) => item.name === selectedMonth);

  return (
    <div style={styles.dashboard}>
      <div style={styles.filterButtons}>
        <select
          style={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">Months</option>
          {monthlyData.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.metrics}>
        {metrics.map((metric) => (
          <div
            key={metric.title}
            style={styles.card(selectedMetric === metric.key)}
            onClick={() => setSelectedMetric(metric.key)}
          >
            <h3 style={styles.cardTitle}>{metric.title}</h3>
            <p style={styles.cardValue}>{metric.value}</p>
            <span style={{ ...styles.cardChange, color: metric.color }}>
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartBoard;
