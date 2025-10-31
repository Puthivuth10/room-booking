import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";
import "../styles/available_room.css";
import "boxicons/css/boxicons.min.css";
import ruppLogo from "../assets/rupp_logo.png";

// The AvailableRoom component displays a list of available rooms,
// includes a search bar to filter rooms, and a responsive navigation menu.
const AvailableRoom = () => {
  // State for the search term typed by the user
  const [searchTerm, setSearchTerm] = useState("");
  // State for controlling visibility of the mobile navigation menu
  const [menuShown, setMenuShown] = useState(false);

  // Hardcoded array of room objects with relevant details
  const rooms = [
    {
      id: 1,
      title: "STEM 303",
      status: "Available",
      description: "Computer Lab (Capacity: 34)",
      availability: "Mon-Fri, 8AM-5PM",
      imgSrc: "pic2.jpg",
      link: "/pick_form",
    },
    {
      id: 2,
      title: "STEM 303",
      status: "Available",
      description: "Computer Lab (Capacity: 34)",
      availability: "Mon-Fri, 8AM-5PM",
      imgSrc: "Stem.jpg",
      link: "/pick_form",
    },
    {
      id: 3,
      title: "STEM 306",
      status: "Available",
      description: "Computer Lab (Capacity: 24)",
      availability: "Tue-Thu, 8AM-5PM",
      imgSrc: "pic3.jpg",
      link: "/pick_form",
    },
  ];

  // Filter rooms based on searchTerm matching title or description (case-insensitive)
  const filteredRooms = rooms.filter((room) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      room.title.toLowerCase().includes(lowerSearch) ||
      room.description.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="available-room-page">
      {/* Header with Navigation */}
      <header className="header">
        <nav className="nav bd-grid">
          {/* Logo and Title */}
          <div className="logo-container">
            <Link to="/" className="nav-logo">
              <img src={ruppLogo} alt="RUPP Logo" />
            </Link>
            <span className="username-logo">
              Royal University Of Phnom Penh
            </span>
          </div>

          {/* Navigation Menu Links */}
          <div
            className={`nav_menu ${menuShown ? "show-menu" : ""}`}
            id="nav_menu"
          >
            <ul className="nav_list">
              <li className="nav_items">
                <Link to="/home/home" className="nav_link">
                  Home
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/about" className="nav_link">
                  About
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
                <Link to="/" className="nav_link">
                  Setting
                </Link>
              </li> */}
              {/* Display username */}
              <li className="nav_items username-item">
                <span className="username">Mr. Username</span>
              </li>
            </ul>
          </div>

          {/* Mobile menu toggle button */}
          <div
            className="nav__toggle"
            id="nav-toggle"
            onClick={() => setMenuShown(!menuShown)}
          >
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      {/* Search bar for filtering rooms */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main content area: Room list */}
      <div className="room-selection">
        <h1>STEM Building</h1>

        {/* Display filtered rooms */}
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div className="room_card" key={room.id}>
              {/* Room Image */}
              <div className="room_image">
                <img src={room.imgSrc} alt={room.description} />
              </div>
              {/* Room Details */}
              <div className="room_info">
                <h3>{room.title}</h3>
                <span className="status">{room.status}</span>
                <p>{room.description}</p>
                <p>
                  <i className="bx bx-calendar"></i> Available:{" "}
                  {room.availability}
                </p>
              </div>
              {/* Booking Button */}
              <Link to={room.link} className="book-btn" role="button">
                Book This Room
              </Link>
            </div>
          ))
        ) : (
          <p>No rooms match your search.</p>
        )}
      </div>

      {/* Back button to navigate to the book page */}
      <div className="back-button">
        <Link to="/book" className="btn-back">
          <i className="bx bx-arrow-back"></i> Back
        </Link>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem 0",
          background: "#f4f4f4",
        }}
      >
        &copy; 2025 Royal University Of Phnom Penh. All rights reserved.
      </footer>
    </div>
  );
};

export default AvailableRoom;
