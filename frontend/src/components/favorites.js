import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // you already imported useNavigate
import ruppLogo from "../assets/rupp_logo.png";
import "../styles/header.css";
import "../styles/book.css";

const Favorites = () => {
  const [username, setUsername] = useState("");

    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/favorites/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch favorite rooms.");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
            <li className="nav_items username-item">
              <span className="username">{username || "Mr. Username"}</span>
            </li>
          </ul>
        </nav>
      </header>

      <main className="booking-container">
        <div className="booking-content-fav">
          <Link
                  to="/book"
                  className="btn-back"
                  aria-label="Back to Books list"
                >
                  <i className="bx bx-arrow-back"></i> Back to Books
          </Link>
          <h2>My Favorite Rooms</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : rooms.length === 0 ? (
            <p>No favorite rooms found.</p>
            
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
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
                    <p>Type: {room.room_type}</p>
                    <p>Capacity: {room.capacity}</p>
                    {room.description && <p>{room.description}</p>}
                  </div>
                  <Link to={`/room/${room.id}`} className="book-btn">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer
        style={{ textAlign: "center", padding: "1rem", background: "#f4f4f4" }}
      >
        &copy; 2025 Royal University Of Phnom Penh. All rights reserved.
      </footer>
    </div>
  );
};

export default Favorites;
