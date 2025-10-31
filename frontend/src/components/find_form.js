import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import "../styles/form.css";
import "boxicons/css/boxicons.min.css";
import ruppLogo from "../assets/rupp_logo.png";

const BookingForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/available_room");
  };

  return (
    <div className="booking-form-page">
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
          <div className="nav_menu" id="nav_menu">
            <ul className="nav_list">
              <li className="nav_items">
                <Link to="/home" className="nav_link">
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
              <li className="nav_items username-item">
                <span className="username">Mr. Username</span>
              </li>
            </ul>
          </div>
          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="form-container">
        <section className="form-section">
          <div className="form-content">
            <h2>Room Booking Form</h2>
            <p>
              Teachers can reserve our university room for meeting, discussions,
              or special sessions.
            </p>
            <form onSubmit={handleSubmit} className="form-features">
              <div className="form-group">
                <label htmlFor="room-type">Room Type</label>
                <input
                  type="text"
                  id="room-type"
                  name="room-type"
                  placeholder="e.g, Robotic Lab"
                />
              </div>
              <div className="form-group">
                <label htmlFor="book-date">Book Date</label>
                <input type="date" id="book-date" name="book-date" />
              </div>

              <div className="form-group">
                <label htmlFor="start-time">Start time</label>
                <input type="time" id="start-time" name="start-time" />
              </div>
              <div className="form-group">
                <label htmlFor="end-time">End time</label>
                <input type="time" id="end-time" name="end-time" />
              </div>
              <div className="button-group">
                <button
                  type="reset"
                  className="back-btn"
                  aria-label="Reset the form"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  aria-label="Submit and go"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="back-button">
          <Link to="/book" className="btn-back">
            <i className="bx bx-arrow-back"></i> Back
          </Link>
        </div>
      </main>
    </div>
  );
};
export default BookingForm;
