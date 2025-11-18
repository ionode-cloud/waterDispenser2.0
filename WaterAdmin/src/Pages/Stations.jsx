import React, { useState, useEffect } from "react";
import "../App.css";

const Station = () => {
  const initialStations = () => {
    const stored = localStorage.getItem("stationData");
    return stored
      ? JSON.parse(stored)
      : [
        {
          name: "DN Fairytale",
          connectors: "1",
          status: [{ color: "green", count: 1 }],
          city: "Khorda",
          pincode: "752054",
          state: "Odisha",
          publish: "Yes",
          details: {
            mobile: "9876543210",
            tank: "30000",
            latitude: "20.2961",
            longitude: "85.8245",
            status: "Online",
            type: "Public",
            location: "Durgapur, Khorda Odisha 752054",
          },
        },
      ];
  };

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
  ];

  const [stations, setStations] = useState(initialStations);
  const [filteredStations, setFilteredStations] = useState(initialStations);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Dispensions");
  const [selectedState, setSelectedState] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  const [newStation, setNewStation] = useState({
    name: "",
    connectors: "",
    city: "",
    pincode: "",
    state: "",
    publish: "",
    status: [{ color: "green", count: 0 }],
    details: {
      mobile: "",
      tank: "",
      latitude: "",
      longitude: "",
      status: "Online",
      type: "Public",
      location: "",
    },
  });

  useEffect(() => {
    localStorage.setItem("stationData", JSON.stringify(stations));
    applyFilter(selectedState, searchQuery);
  }, [stations]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    applyFilter(state);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const { latitude, longitude } = newStation.details;
      if (!latitude || !longitude) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        if (data?.display_name) {
          setNewStation((prev) => ({
            ...prev,
            details: {
              ...prev.details,
              location: data.display_name,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [newStation.details.latitude, newStation.details.longitude]);

  const applyFilter = (state, query = searchQuery) => {
    let result = stations;

    if (state !== "all") {
      result = result.filter((item) => item.state === state);
    }

    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.city.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredStations(result);
  };


  const handleAddStation = (e) => {
    e.preventDefault();
    setStations([...stations, newStation]);
    setNewStation({
      name: "",
      connectors: "",
      city: "",
      pincode: "",
      state: "",
      publish: "",
      status: [{ color: "green", count: 0 }],
      details: {
        mobile: "",
        tank: "",
        latitude: "",
        longitude: "",
        status: "Online",
        type: "Public",
        location: "",
      },
    });
    setShowAddForm(false);
  };

  const handleDeleteStation = () => {
    if (!selectedStation) return;
    setStations((prev) => prev.filter((s) => s.name !== selectedStation.name));
    setSelectedStation(null);
  };
  const handleRestartStation = () => {
    if (!selectedStation) return;
    alert(`${selectedStation.name} is restarting...`);
  };

  const handleStartServices = () => {
    if (!selectedStation) return;
    alert(`Services started for ${selectedStation.name}`);
  };

  return (
    <div className="station-container">
      <h2 class="home-card-title">
        Stations
      </h2>
      <div className="station-header">
        <div className="filter-row">
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="action-btn outline"
          >
            <option value="all">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="station-header-actions">
          <div className="station-right">
            <input
              type="text"
              className="sation-data"
              placeholder="Search by station name or city"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                applyFilter(selectedState, e.target.value);
              }}
            />

          </div>
          <button className="station-add-btn" onClick={() => setShowAddForm(true)}>
            + Add
          </button>
          <span className="station-total">
            Total Stations: {filteredStations.length}
          </span>
        </div>
      </div>
      {/* Station Table */}
      <div className="station-table-wrapper">
        <table className="station-table">
          <thead>
            <tr>
              <th>Dispension Name</th>
              <th>Total Nozzel</th>
              <th>Nozzel Status</th>
              <th>City</th>
              <th>Pincode</th>
              <th>State</th>
              <th>Publish</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.map((station, index) => (
              <tr
                key={index}
                onClick={() => setSelectedStation(station)}
                className="station-table-row"
              >
                <td>{station.name}</td>
                <td className="station-center">{station.connectors}</td>
                <td>
                  <div className="station-status-container">
                    {station.status.map((s, idx) => (
                      <span
                        key={idx}
                        className={`station-status-badge ${s.color}`}
                      >
                        <span className="station-dot"></span> {s.count}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{station.city}</td>
                <td>{station.pincode}</td>
                <td>{station.state}</td>
                <td>{station.publish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="station-modal">
          <div className="station-modal-content">
            <button
              className="station-close"
              onClick={() => setShowAddForm(false)}
            >
              ✖
            </button>
            <h2>Add New Dispension</h2>
            <form onSubmit={handleAddStation} className="station-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Station Name</label>
                  <input
                    type="text"
                    value={newStation.name}
                    onChange={(e) =>
                      setNewStation({ ...newStation, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Nozzel</label>
                  <input
                    type="number"
                    value={newStation.connectors}
                    onChange={(e) =>
                      setNewStation({ ...newStation, connectors: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>State</label>
                <select
                  value={newStation.state}
                  onChange={(e) =>
                    setNewStation({ ...newStation, state: e.target.value })
                  }
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={newStation.city}
                    onChange={(e) =>
                      setNewStation({ ...newStation, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="number"
                    value={newStation.pincode}
                    onChange={(e) =>
                      setNewStation({ ...newStation, pincode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Station Type (Public / Private)</label>
                  <input
                    type="text"
                    value={newStation.details.type}
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        details: { ...newStation.details, type: e.target.value },
                      })
                    }
                    placeholder="e.g. Public or Private"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Publish</label>
                  <select
                    value={newStation.publish}
                    onChange={(e) =>
                      setNewStation({ ...newStation, publish: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile No</label>
                  <input
                    type="tel"
                    value={newStation.details.mobile}
                    placeholder="+91"
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        details: {
                          ...newStation.details,
                          mobile: e.target.value.startsWith("+91")
                            ? e.target.value
                            : `+91${e.target.value}`,
                        },
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tank Capacity (L)</label>
                  <input
                    type="number"
                    value={newStation.details.tank}
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        details: { ...newStation.details, tank: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="text"
                    value={newStation.details.latitude}
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        details: { ...newStation.details, latitude: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="text"
                    value={newStation.details.longitude}
                    onChange={(e) =>
                      setNewStation({
                        ...newStation,
                        details: { ...newStation.details, longitude: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address (from Geo)</label>
                <input
                  type="text"
                  value={newStation.details.location}
                  readOnly
                />
              </div>

              <button type="submit" className="submit-btn">Add Station</button>
            </form>



          </div>
        </div>
      )}

      {/* Slide Panel */}
      <div className={`station-slide-panel ${selectedStation ? "open" : ""}`}>
        <button
          className="station-close-btn"
          onClick={() => setSelectedStation(null)}
        >
          ✖
        </button>
        {selectedStation && (
          <>
            <div className="station-panel-content two-column-layout">
              {/* LEFT */}
              <div className="station-details-left">
                <p className="station-address">
                  {selectedStation.details?.location}
                </p>
                <div className="station-map-container">
                  {selectedStation && selectedStation.details && (
                    <iframe
                      title="station-map"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${selectedStation.details.latitude},${selectedStation.details.longitude}&z=15&output=embed`}
                    />
                  )}
                </div>
                <div className="station-info-cards">
                  <div className="station-card">
                    <p>Status</p>
                    <h4>{selectedStation.details?.status || "Unknown"}</h4>
                  </div>
                  <div className="station-card">
                    <p>Nozzel Status</p>
                    <h4>Active</h4>
                  </div>
                  <div className="station-card">
                    <p>Tank Capacity</p>
                    <h4>{selectedStation.details?.tank}L</h4>
                  </div>
                  <div className="station-card">
                    <p>Geolocation</p>
                    <h4>
                      {selectedStation.details?.latitude},{" "}
                      {selectedStation.details?.longitude}
                    </h4>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="station-details-right">
                <div className="station-tab-header">
                  {["Dispensions", "Dispension Statistics", "Tokens"].map((tab) => (
                    <span
                      key={tab}
                      className={activeTab === tab ? "active-tab" : "inactive-tab"}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                {activeTab === "Dispensions" && (
                  <table className="station-overview-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Station ID</th>
                        <th>Serial Number</th>
                        <th>Status</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{selectedStation.name}</td>
                        <td>0912f698</td>
                        <td>SI-072025/03</td>
                        <td>Bus Stand</td>
                        <td>Online</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {activeTab === "Dispension Statistics" && (
                  <div className="station-statistics">
                    <div className="station-date-range">
                      <input type="date" />
                    </div>
                    <div className="station-stats-grid">
                      <div className="station-card">
                        <p>PH</p>
                        <h4>10</h4>
                      </div>
                      <div className="station-card">
                        <p>TDS</p>
                        <h4>02</h4>
                      </div>
                      <div className="station-card">
                        <p>Turbidity</p>
                        <h4>10</h4>
                      </div>
                      <div className="station-card">
                        <p>Water Level</p>
                        <h4>589L</h4>
                      </div>
                      <div className="station-card">
                        <p>D1</p>
                        <h4>1</h4>
                      </div>
                      <div className="station-card">
                        <p>D2</p>
                        <h4>1</h4>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Tokens" && <h2>Not ready................</h2>}
              </div>
            </div>
          </>
        )}
        <div className="station-btn">
          <button className="station-restart-btn" onClick={handleRestartStation}>
            Restart Station
          </button>
          <button className="station-start-btn" onClick={handleStartServices}>
            Start Services
          </button>
          <button className="station-delete-btn" onClick={handleDeleteStation}>
            Delete Station
          </button>
        </div>

      </div>
    </div>
  );
};

export default Station;
