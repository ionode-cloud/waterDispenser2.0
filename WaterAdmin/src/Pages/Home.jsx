import React from "react";
import "../App.css";
import ApexChart from "../Components/ApexChart";
import IndiaMap from "../Components/IndiaMap";
import ChartBoard from "../Components/ChartBoard";
import { useSelector, useDispatch } from "react-redux";
import {
  updateTotal,
  updateAvailable,
  updateUnavailable,
  updateFaulted,
} from "../Store/Slices/dispensionSlice.js";

const Home = () => {
  //  Read data from Redux store
  const Dispension = useSelector((state) => state.dispension);

  //  Dispatch actions to update state
  const dispatch = useDispatch();

  const StatCard = ({ title, count, color }) => (
    <div className={`home-card home-stat-card ${color}`}>
      <h3 className="home-card-title">{title}</h3>
      <div className="home-stat-count">{count}</div>
    </div>
  );

  return (
    <div className="home-dashboard-container">
      <div className="home-content-container">
        <h2 className="home-card-title">Water Dispensation Station</h2>
        <div className="home-grid-layout">
          <div className="home-col-span-1 home-space-y-6">
            <div className="home-card home-map-card">
              <div className="home-full-width">
                <IndiaMap />
              </div>
            </div>
            <div className="home-card home-session-metrics-card">
              <h2 className="home-card-title">User Chart</h2>
              <div className="home-chart-placeholder home-padding-2">
                <ApexChart />
              </div>
            </div>
          </div>

          <div className="home-col-span-2 home-space-y-6">
            <div>
              <div className="home-grid-layout home-metrics-grid">
                <StatCard {...Dispension.total} title="Total Dispension" />
                <StatCard {...Dispension.available} title="Available" />
                <StatCard {...Dispension.unavailable} title="Unavailable" />
                <StatCard {...Dispension.faulted} title="Faulted" />
              </div>
            </div>

            <div className="home-card">
              <ChartBoard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
