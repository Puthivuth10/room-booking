import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/header.css";
import "../styles/ticket.css";
import ruppLogo from "../assets/rupp_logo.png";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Ticket = () => {
  const modalRef = useRef(null);
  const theme = createTheme({
    zIndex: {
      modal: 1300,
      popover: 1500, // Make popover higher than your modal
    },
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeSection] = useState("tickets");
  const [activeTicketTab, setActiveTicketTab] = useState("Upcoming");
  const [tickets, setTickets] = useState({ Upcoming: [], Past: [] });
  const showBuilding = (tab) => setActiveTicketTab(tab);
  const [editingBooking, setEditingBooking] = useState(null); // store booking info to edit
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const [editForm, setEditForm] = useState({
    booking_date: "",
    start_time: "",
    end_time: "",
    room: null,
    booker: null,
  });

 
  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      booking_date: dayjs(booking.booking_date),
      start_time: dayjs(booking.start_time),
      end_time: dayjs(booking.end_time),
      room_id: booking.room?.id || booking.room_id,
      booker: booking.booker,
    });
  };

  // prevent scroll when pop up
  useEffect(() => {
    if (editingBooking) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }

    // Cleanup if component unmounts
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [editingBooking]);

  useEffect(() => {
    const parseJwt = (token) => {
      if (!token) return null;
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      try {
        return JSON.parse(atob(base64));
      } catch {
        return null;
      }
    };

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
    } else {
      const decodedUser = parseJwt(accessToken);
      setUser(decodedUser);
    }
  }, [navigate]);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/getallmybooking/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        console.log("Fetched bookings:", data);
        console.log("Sample booking object:", data[0]); // 👈 ADD THIS LINE

        const upcoming = [];
        const past = [];

        data.forEach((booking) => {
          const startDateTimeStr = `${booking.booking_date}T${booking.start_time}`;
          const endDateTimeStr = `${booking.booking_date}T${booking.end_time}`;

          const start = new Date(startDateTimeStr);
          const end = new Date(endDateTimeStr);
          const now = new Date();

          const ticket = {
            imgSrc: booking.room?.image
              ? `http://127.0.0.1:8000${booking.room.image}`
              : "http://127.0.0.1:8000/static/default-image.png",
            alt: `Room ${booking.room}`,
            status: start > now ? "Upcoming" : "Completed",
            statusClass: start > now ? "status-upcoming" : "status-past",
            title: `Room ${booking.room?.room_number ?? "Unknown Room"}`,
            date: start.toLocaleDateString(),
            time: `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`,
            hasCheckIn: start > now,
            hasReceipt: start < now,

            id: booking.id,
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,

            room: booking.room, // so PUT/POST works with room ID
            booker: booking.booker,
          };

          console.log("Fetched bookings:", data);

          if (start > now) {
            upcoming.push(ticket);
          } else {
            past.push(ticket);
          }
        });

        setTickets({ Upcoming: upcoming, Past: past });
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
    };

    fetchBookings();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data); // data.username will now be correct
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);
  

  return (
    <>
      <header className="header">
        <nav className="nav">
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
                <Link to="/home" className="nav_link">
                  Home
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/book" className="nav_link">
                  Books
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/ticket" className="nav_link active-link">
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
                <span className="username">
                  {user?.username || "Mr. Username"}
                </span>
              </li>
            </ul>
          </div>

          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="ticket-container">
        {/* <div className="ticket-sidebar">
          <h2>Ticket</h2>
          <ul>
            <li
              className={`side ${activeSection === "tickets" ? "active" : ""}`}
              onClick={() => showSection("tickets")}
            >
              <i className="bx bx-ticket"></i> Ticket Detail
            </li>
            <li
              className={`side ${activeSection === "booking" ? "active" : ""}`}
              onClick={() => showSection("booking")}
            >
              <i className="bx bx-history"></i> Booking History
            </li>
          </ul>
        </div> */}

        <div className="ticket-content">
          {activeSection === "tickets" && (
            <div className="section-content" id="tickets-section">
              <div className="availablity">
                <ul>
                  {["Upcoming", "Past"].map((tab) => (
                    <li
                      key={tab}
                      className={`text ${
                        activeTicketTab === tab ? "active" : ""
                      }`}
                      onClick={() => showBuilding(tab)}
                    >
                      {tab}
                    </li>
                  ))}
                </ul>
                <div className="icon">
                  <i className="bx bx-star" title="Favorites"></i>
                  <i className="bx bx-bell" title="Reminders"></i>
                </div>
              </div>
              <hr />

              <div className="tickets">
                {tickets[activeTicketTab].length > 0 ? (
                  tickets[activeTicketTab].map((ticket, idx) => (
                    <div key={idx} className="ticket-card">
                      <img src={ticket.imgSrc} alt={ticket.alt} />
                      <div className="ticket-info">
                        <span className={`ticket-status ${ticket.statusClass}`}>
                          {ticket.status}
                        </span>
                        <h3>{ticket.title}</h3>
                        <div className="ticket-meta">
                          <span>
                            <i className="bx bx-calendar"></i> {ticket.date}
                          </span>
                          <span>
                            <i className="bx bx-time"></i> {ticket.time}
                          </span>
                        </div>
                        <div className="ticket-actions">
                          {/* DELETE BUTTON */}
                          {activeTicketTab === "Upcoming" && (
                            <button
                              className="ticket-btn btn-danger"
                              onClick={() => {
                                setBookingToDelete(ticket);
                                setShowDeletePopup(true);
                              }}
                            >
                              <i className="bx bx-trash"></i> Delete
                            </button>

                          )}

                          {/* EDIT BUTTON for upcoming bookings */}
                          {activeTicketTab === "Upcoming" &&
                            ticket.hasCheckIn && (
                              <button
                                className="ticket-btn btn-warning"
                                onClick={() => handleEditClick(ticket)}
                              >
                                <i className="bx bx-edit"></i> Edit
                              </button>
                            )}

                          {/* RECEIPT BUTTON for past bookings */}
                          {activeTicketTab === "Past" && ticket.hasReceipt && (
                            <button className="ticket-btn btn-secondary">
                              <i className="bx bx-receipt"></i> Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "1.2rem", marginTop: "2rem" }}>
                    No {activeTicketTab.toLowerCase()} tickets available.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeSection === "booking" && (
            <div className="section-content" id="booking-section">
              <h2>Booking History</h2>
              <p>
                Your past bookings will appear here. This feature is coming
                soon!
              </p>
              <div className="coming-soon">
                <img
                  src="https://img.icons8.com/fluency/96/clock--v1.png"
                  alt="Coming soon"
                />
                <p>We're working on this feature</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {editingBooking && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h3>Edit Booking</h3>

            <div className="form-field">
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={editForm.booking_date || null}
                    onChange={(newDate) => {
                      console.log(
                        "Selected Date:",
                        newDate,
                        "Is valid?",
                        newDate?.isValid()
                      ); // ✅ here
                      setEditForm({
                        ...editForm,
                        booking_date: newDate,
                      });
                    }}
                    slotProps={{
                      popper: {
                        disablePortal: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
            <div className="form-field">
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Select Start Time"
                    type="time"
                    value={editForm.start_time}
                    onChange={(newTime) =>
                      setEditForm({
                        ...editForm,
                        start_time: newTime,
                      })
                    }
                    slotProps={{
                      popper: {
                        disablePortal: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
            <div className="form-field">
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="End Time"
                    value={editForm.end_time}
                    onChange={(newTime) =>
                      setEditForm({
                        ...editForm,
                        end_time: newTime,
                      })
                    }
                    slotProps={{
                      popper: {
                        disablePortal: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                onClick={async () => {
                  try {
                    const formattedData = {
                      ...editForm,
                      booking_date: editForm.booking_date.format("YYYY-MM-DD"),
                      start_time: editForm.start_time.format("HH:mm"),
                      end_time: editForm.end_time.format("HH:mm"),
                    };
                    console.log("PUT request body:", editForm);
                    const response = await fetch(
                      `http://127.0.0.1:8000/api/getallmybooking/${editingBooking.id}/`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                          )}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formattedData),
                      }
                    );

                    const result = await response.json();
                    console.log("Response status:", response.status);
                    console.log("Response body:", result);

                    if (!response.ok)
                      throw new Error(
                        result.detail || "Failed to update booking"
                      );

                    alert("Booking updated successfully");
                    setEditingBooking(null);
                    window.location.reload();
                  } catch (err) {
                    console.error("Error:", err);
                    alert("Failed to update booking: " + err.message);
                  }
                }}
              >
                Save
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingBooking(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && bookingToDelete && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this booking?</p>
            <div className="popup-buttons">
              <button
                className="btn btn-danger"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `http://127.0.0.1:8000/api/getallmybooking/${bookingToDelete.id}/`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                          )}`,
                        },
                      }
                    );

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.detail || "Failed to delete booking");
                    }

                    // Update state after successful delete
                    setTickets((prevTickets) => {
                      const newTickets = { ...prevTickets };
                      newTickets[activeTicketTab] = newTickets[
                        activeTicketTab
                      ].filter((t) => t.id !== bookingToDelete.id);
                      return newTickets;
                    });

                    setShowDeletePopup(false);
                    setBookingToDelete(null);
                  } catch (err) {
                    alert("Error deleting booking: " + err.message);
                    setShowDeletePopup(false);
                    setBookingToDelete(null);
                  }
                }}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeletePopup(false);
                  setBookingToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <footer
        style={{
          textAlign: "center",
          padding: "1rem 0",
          background: "#f4f4f4",
        }}
      >
        &copy; 2025 Royal University Of Phnom Penh. All rights reserved.
      </footer>
    </>
  );
};

export default Ticket;
