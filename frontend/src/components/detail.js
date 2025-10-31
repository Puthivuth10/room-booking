import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import "../styles/detail.css";
import "boxicons/css/boxicons.min.css";
import ruppLogo from "../assets/rupp_logo.png";

const ticketData = {
  306: {
    roomName: "Room 306 - Computer Lab",
    status: "Upcoming",
    image: "307.jpg",
    date: "May 15, 2023",
    time: "2:00 PM - 4:00 PM",
    booker: "Mr. Username",
    bookingId: "RUPP-2023-0567",
    capacity: "40 Students",
    description:
      "This is a computer lab equipped with 40 high-performance computers for programming and software development classes. The room has air conditioning and projector facilities.",
  },
  307: {
    roomName: "Room 307 - Lecture Hall",
    status: "Completed",
    image: "300.jpg",
    date: "May 10, 2023",
    time: "9:00 AM - 11:00 AM",
    booker: "Mr. Username",
    bookingId: "RUPP-2023-0421",
    capacity: "120 Students",
    description:
      "Large lecture hall with seating for 120 students. Equipped with a high-quality sound system and multiple projectors. Ideal for guest lectures and large classes.",
  },
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (ticketData[id]) {
      setTicket(ticketData[id]);
    } else {
      setTicket(null);
    }
  }, [id]);

  if (!ticket) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Ticket not found</h2>
        <p>The requested ticket does not exist.</p>
        <button
          onClick={() => navigate("/ticket")}
          className="btn-back"
          aria-label="Back to ticket list"
          style={{ marginTop: "1rem" }}
        >
          <i className="bx bx-arrow-back"></i> Back to Tickets
        </button>
      </main>
    );
  }

  // Normalize status className for styling
  const statusClass = `ticket-status status-${ticket.status.toLowerCase()}`;

  // Fallback image path
  const imagePath = ticket.image ? `/${ticket.image}` : "/default-room.jpg";

  return (
    <div className="ticket-detail-page">
      <header className="header">
        <nav className="nav">
          <div className="logo-container">
            <Link to="/" className="nav-logo" aria-label="Go to homepage">
              <img src={ruppLogo} alt="RUPP Logo" />
            </Link>
            <span className="username-logo">
              Royal University Of Phnom Penh
            </span>
          </div>
          <div className="nav_menu" id="nav_menu">
            <ul className="nav_list">
              <li className="nav_items">
                <Link to="/home/home" className="nav_link" tabIndex={0}>
                  Home
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/about" className="nav_link" tabIndex={0}>
                  About
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/book" className="nav_link">
                  Books
                </Link>
              </li>
              <li className="nav_items">
                <Link
                  to="/ticket"
                  className="nav_link active-link"
                  tabIndex={0}
                >
                  Tickets
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/contact" className="nav_link" tabIndex={0}>
                  Contact
                </Link>
              </li>
              {/* <li className="nav_items">
                <Link to="/" className="nav_link" tabIndex={0}>
                  Setting
                </Link>
              </li> */}
              <li className="nav_items username-item">
                <span className="username" aria-label="Logged in user">
                  Mr. Username
                </span>
              </li>
            </ul>
          </div>
          <div
            className="nav__toggle"
            id="nav-toggle"
            tabIndex={0}
            role="button"
            aria-label="Toggle navigation menu"
          >
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="ticket-detail-container" tabIndex={-1}>
        <div
          className="ticket-detail-card"
          role="region"
          aria-labelledby="ticket-title"
        >
          <div className="ticket-detail-header">
            <h1 id="ticket-title">{ticket.roomName}</h1>
            <span className={statusClass} aria-live="polite" aria-atomic="true">
              {ticket.status}
            </span>
          </div>

          <div className="ticket-detail-body">
            <img
              src={imagePath}
              alt={`Photo of ${ticket.roomName}`}
              className="detail-image"
              onError={(e) => (e.currentTarget.src = "/default-room.jpg")}
            />

            <div className="detail-info-grid">
              <DetailInfoItem
                icon="bx-calendar"
                label="Date"
                value={ticket.date}
              />
              <DetailInfoItem icon="bx-time" label="Time" value={ticket.time} />
              <DetailInfoItem
                icon="bx-user"
                label="Booked By"
                value={ticket.booker}
              />
              <DetailInfoItem
                icon="bx-group"
                label="Capacity"
                value={ticket.capacity}
              />
              <DetailInfoItem
                icon="bx-id-card"
                label="Booking ID"
                value={ticket.bookingId}
              />
            </div>

            <section
              className="detail-description"
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading">Description</h2>
              <p>{ticket.description}</p>
            </section>
          </div>

          <div className="ticket-detail-footer">
            <button
              className="ticket-btn btn-secondary"
              onClick={() => window.print()}
              aria-label="Print ticket"
            >
              <i className="bx bx-printer"></i> Print Ticket
            </button>
            {ticket.status === "Upcoming" && (
              <button
                className="ticket-btn btn-primary"
                onClick={() => alert("Check-in successful!")}
                aria-label="Check in to the event"
              >
                <i className="bx bx-qr-scan"></i> Check In
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="back-button">
        <Link
          to="/ticket"
          className="btn-back"
          aria-label="Back to ticket list"
        >
          <i className="bx bx-arrow-back"></i> Back to Tickets
        </Link>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem 0",
          background: "#f4f4f4",
        }}
        aria-label="Footer"
      >
        &copy; 2025 Royal University Of Phnom Penh. All rights reserved.
      </footer>
    </div>
  );
};

function DetailInfoItem({ icon, label, value }) {
  return (
    <div className="detail-info-item">
      <i className={`bx ${icon}`} aria-hidden="true"></i>
      <div>
        <h3>{label}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}
export default TicketDetail;
