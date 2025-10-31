import React, { useState } from "react";
import "../styles/header.css";
import "../styles/pick_form.css";
import "boxicons/css/boxicons.min.css";
import ruppLogo from "../assets/rupp_logo.png";

const PickForm = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    // You can add validation here if needed
    setShowModal(true);
  };

  const handleReset = (e) => {
    // This will reset the form and hide the modal if shown
    e.target.form.reset();
    setShowModal(false);
  };

  return (
    <div className="pick-form-page">
      <header className="header">
        <nav className="nav bd-grid">
          <div className="logo-container">
            <a href="index.html" className="nav-logo">
              <img src={ruppLogo} alt="RUPP Logo" />
            </a>
            <span className="username-logo">
              Royal University Of Phnom Penh
            </span>
          </div>
          <div className="nav_menu" id="nav_menu">
            <ul className="nav_list">
              <li className="nav_items">
                <a href="home.html" className="nav_link">
                  Home
                </a>
              </li>
              <li className="nav_items">
                <a href="about.html" className="nav_link">
                  About
                </a>
              </li>
              <li className="nav_items">
                <a href="book.html" className="nav_link active-link">
                  Books
                </a>
              </li>
              <li className="nav_items">
                <a href="ticket.html" className="nav_link">
                  Ticket
                </a>
              </li>
              {/* <li className="nav_items">
                <a href="index.html" className="nav_link">
                  Setting
                </a>
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
            <form action="findroom.html" method="get" className="form-features">
              <div className="form-group">
                <label htmlFor="room-type">Room Type</label>
                <input
                  type="text"
                  id="room-type"
                  name="room-type"
                  placeholder="Robotic Lab"
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
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="submit-btn"
                  id="submitBtn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>

            {showModal && (
              <div id="confirmationModal" className="modal">
                <div className="modal-content">
                  <h2>Room Reserved!</h2>
                  <p>Your room has been successfully reserved.</p>
                  <div className="modal-actions">
                    <a href="/home/home.html">Go to Home</a>
                    <a href="ticket.html">View Ticket</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="back-button">
          <a href="book.html" className="btn-back">
            <i className="bx bx-arrow-back"></i> Back
          </a>
        </div>
      </main>
    </div>
  );
};
export default PickForm;
