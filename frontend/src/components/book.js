import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ruppLogo from "../assets/rupp_logo.png";
import "../styles/header.css";
import "../styles/book.css";
import "boxicons/css/boxicons.min.css";

const buildingsList = [
  { id: "stem_building", name: "Stem Building" },
  { id: "building_A", name: "Building A" },
  { id: "building_B", name: "Building B" },
  { id: "building_C", name: "Building C" },
  { id: "building_D", name: "Building D" },
  { id: "building_T", name: "Building T" },
];

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/getallrooms/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await res.json();
        const roomArray = Array.isArray(data) ? data : [];
        setRooms(roomArray);
        setFilteredRooms(roomArray);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
        setFilteredRooms([]);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    if (selectedBuilding !== null) {
      filtered = filtered.filter((room) => room.building === selectedBuilding);
    }

    if (roomTypeFilter) {
      filtered = filtered.filter((room) => room.room_type === roomTypeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.room_number.toLowerCase().includes(term) ||
          (room.description && room.description.toLowerCase().includes(term))
      );
    }

    setFilteredRooms(filtered);
  }, [selectedBuilding, roomTypeFilter, searchTerm, rooms]);

  const handleLogout = () => {
  setShowLogoutPopup(true);
  };

  const confirmLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");
      navigate("/home");
    }
  };


  return (
    <div className="book-room-page">
      {/* Header */}
      <header className="header">
        <nav className="nav bd-grid">
          <div className="logo-container">
            <Link to="/" className="nav-logo">
              <img src={ruppLogo} alt="RUPP Logo" />
            </Link>
            <span className="username-logo">
              Royal University Of Phnom Penh
            </span>
          </div>
          <ul className="nav_list">
            <li className="nav_items">
              <Link to="/home" className="nav_link">
                Home
              </Link>
            </li>
            <li className="nav_items">
              <Link to="/book" className="nav_link active-link">
                Books
              </Link>
            </li>
            <li className="nav_items">
              <Link to="/ticket" className="nav_link">
                Ticket
              </Link>
            </li>
            {/* <li className="nav_items">
              <Link to="/setting" className="nav_link">
                Setting
              </Link>
            </li> */}
            <li className="nav_items">
              <Link to="/about" className="nav_link">
                About
              </Link>
            </li>
            <li className="nav_items">
              <button
                onClick={handleLogout}
                className="logout_bt"
              >
                LogOut
              </button>
            </li>
            <li className="nav_items username-item">
              <span className="username">{username || "Mr. Username"}</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="booking-container">
        <div className="booking-sidebar">
          <h2>Buildings</h2>
          {/* <button
            className="fav_bt"
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </button> */}
          <ul>
            {buildingsList.map((building) => (
              <li
                key={building.id}
                className={selectedBuilding === building.id ? "active" : ""}
                onClick={() => setSelectedBuilding(building.id)}
              >
                {building.name}
              </li>
            ))}
            <li
              onClick={() => setSelectedBuilding(null)}
              style={{ marginTop: "1rem", cursor: "pointer" }}
            >
              Show All
            </li>
            <li
              onClick={() => navigate("/favorites")}
              style={{ marginTop: "1rem", cursor: "pointer" }}
            >
              Favorites
            </li>
          </ul>
        </div>

        <div className="booking-content">
          {/* Filters */}
          <div className="filters-container mb-4">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="roomTypeFilter">Filter by Room Type</label>
                <select
                  id="roomTypeFilter"
                  className="form-select"
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="classroom">Classroom</option>
                  <option value="lab">Laboratory</option>
                  <option value="meeting_room">Meeting Room</option>
                  <option value="conference_hall">Conference Hall</option>
                </select>
              </div>
              <div className="col-md-8">
                <label htmlFor="searchInput">Search Rooms</label>
                <input
                  id="searchInput"
                  type="text"
                  className="form-control"
                  placeholder="Search by room number or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Room Cards */}
          <div className="room-selection">
            <h2>Available Rooms</h2>
            {Array.isArray(filteredRooms) && filteredRooms.length === 0 ? (
              <p>No rooms found.</p>
            ) : (
              <div className="rooms-grid">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="room-card">
                    <div className="room-image">
                      <img
                        src={
                          room.image
                            ? `http://127.0.0.1:8000${room.image}`
                            : "http://127.0.0.1:8000/static/default-image.png"
                        }
                        alt={`Room ${room.room_number}`}
                      />
                    </div>
                    <div className="room-info">
                      <h3>{room.room_number}</h3>
                      <p>
                        Building:{" "}
                        {buildingsList.find((b) => b.id === room.building)
                          ?.name || room.building}
                      </p>
                      <p>Type: {room.room_type}</p>
                      <p>Capacity: {room.capacity}</p>
                      {room.description && <p>{room.description}</p>}
                      <div className="room-features">
                        <span
                          className={`badge ${
                            room.has_projector ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {room.has_projector ? "Projector" : "No Projector"}
                        </span>
                        <span> </span>
                        <span
                          className={`badge ${
                            room.has_aircon ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {room.has_aircon ? "Aircon" : "No Aircon"}
                        </span>
                        <span> </span>
                        <span
                          className={`badge ${
                            room.has_tv ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {room.has_tv ? "TV" : "No TV"}
                        </span>
                      </div>
                    </div>
                    <Link to={`/room/${room.id}`} className="book-btn">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button onClick={confirmLogout} className="btn btn-danger">Yes</button>
              <button onClick={() => setShowLogoutPopup(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer
        style={{ textAlign: "center", padding: "1rem", background: "#f4f4f4" }}
      >
        &copy; 2025 Royal University Of Phnom Penh. All rights reserved.
      </footer>
    </div>
  );
};

export default BookRoom;
