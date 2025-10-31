import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ruppLogo from "../assets/rupp_logo.png";
import "../styles/header.css";
import "../styles/roomDetails.css";
import "boxicons/css/boxicons.min.css";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// import "bootstrap/dist/css/bootstrap.min.css";

const buildingsList = [
  { id: "stem_building", name: "Stem Building" },
  { id: "buiding_A", name: "Building A" },
  { id: "buiding_B", name: "Building B" },
  { id: "buiding_C", name: "Building C" },
  { id: "buiding_D", name: "Building D" },
  { id: "buiding_T", name: "Building T" },
];

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" or "error"
  const [showPopup, setShowPopup] = useState(false);

  const [bookingData, setBookingData] = useState({
    booking_date: dayjs(), // or null if you prefer empty initially
    start_time: dayjs(),
    end_time: dayjs(),
    purpose: "",
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  console.log(
    "Selected Date:",
    selectedDate,
    "Is valid dayjs?",
    dayjs.isDayjs(selectedDate)
  );

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      return true;
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
      return false;
    }
  };

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
  
  // prevent scroll when pop up
    useEffect(() => {
      if (showModal) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }

      // Cleanup if component unmounts
      return () => {
        document.body.classList.remove("body-no-scroll");
      };
    }, [showModal]);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/getallrooms/${roomId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!res.ok) {
          if (res.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) return fetchRoom();
            throw new Error("Unauthorized");
          }
          throw new Error(`Error fetching room: ${res.status}`);
        }
        const data = await res.json();
        setRoom(data);

        // Check if room is favorite
        const favRes = await fetch(
          `http://127.0.0.1:8000/api/rooms/${roomId}/favorite/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (favRes.ok) {
          const favData = await favRes.json();
          setIsFavorite(favData.is_favorite);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/getbookingbyroom/${roomId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!res.ok) {
          if (res.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) return fetchBookings();
            throw new Error("Unauthorized");
          }
          throw new Error(`Error fetching bookings: ${res.status}`);
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
    fetchBookings();
  }, [roomId, navigate]);
  const isRoomAvailable = () => {
    if (
      !bookingData.booking_date ||
      !bookingData.start_time ||
      !bookingData.end_time
    ) {
      return null; // Nothing selected yet
    }

    const selectedDate = bookingData.booking_date.format("YYYY-MM-DD");
    const selectedStart = bookingData.start_time.format("HH:mm");
    const selectedEnd = bookingData.end_time.format("HH:mm");

    for (let booking of bookings) {
      if (booking.booking_date !== selectedDate) continue;

      const existingStart = booking.start_time;
      const existingEnd = booking.end_time;

      if (
        (selectedStart >= existingStart && selectedStart < existingEnd) || // start inside
        (selectedEnd > existingStart && selectedEnd <= existingEnd) || // end inside
        (selectedStart <= existingStart && selectedEnd >= existingEnd) // fully overlap
      ) {
        return false; // Overlap found
      }
    }

    return true; // No conflict
  };
  
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const res = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else {
        const err = await res.json();
        alert("Logout failed: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const toggleFavorite = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/rooms/${roomId}/favorite/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) return toggleFavorite();
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to toggle favorite");
      }

      const data = await res.json();
      setIsFavorite(data.status === "added");
    } catch (err) {
      alert("Error toggling favorite: " + err.message);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...bookingData,
      room_id: room.id,
      booking_date: bookingData.booking_date?.format("YYYY-MM-DD") || "", // ensure proper format
      start_time: bookingData.start_time.format("HH:mm"),
      end_time: bookingData.end_time.format("HH:mm"),
      purpose: bookingData.purpose,
    };
    

    try {
      console.log("Booking payload:", payload);
      console.log("TOKEN:", localStorage.getItem("access_token"));
      const res = await fetch("http://127.0.0.1:8000/api/postbooking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData?.non_field_errors?.[0] || "Booking failed");
      // }

      // alert("Booking successful!");
      // setShowModal(false);
      if (!res.ok) {
      const errorData = await res.json();
      setPopupMessage(errorData?.non_field_errors?.[0] || "Booking failed");
      setPopupType("error");
      setShowPopup(true);
      return; // stop here on error
      }

      setPopupMessage("Booking successful!");
      setPopupType("success");
      setShowPopup(true);
      setShowModal(false);


      setBookingData({
        booking_date: dayjs(),
        start_time: dayjs(),
        end_time: dayjs(),
        purpose: "",
      });

      const refreshed = await fetch(
        `http://127.0.0.1:8000/api/getbookingbyroom/${roomId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const updated = await refreshed.json();
      setBookings(updated);
    } catch (err) {
      // alert("Error: " + err.message);
      setPopupMessage("Error: " + err.message);
      setPopupType("error");
      setShowPopup(true);
    }
  };

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!room) return <p>Room not found.</p>;

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
              <span className="username">Mr. Username</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="booking-containers" style={{ padding: "2rem" }}>
        <div className="top">
          <button
            className="btn btn-secondary mb-0"
            onClick={() => navigate(-1)}
          >
            ← Back to Home
          </button>

          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}
          <h1 id="roomTitle" className="card-title mt-1">
            {room.name || `Room ${room.room_number}`}
          </h1>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h5>Book This Room</h5>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-field">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Date"
                      value={bookingData.booking_date || null}
                      onChange={(newDate) => {
                        console.log(
                          "Selected Date:",
                          newDate,
                          "Is valid?",
                          newDate?.isValid()
                        ); // ✅ here
                        setBookingData({
                          ...bookingData,
                          booking_date: newDate,
                        });
                      }}
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "zIndex",
                              enabled: true,
                              phase: "write",
                              fn: ({ state }) => {
                                state.styles.popper.zIndex = 2100;
                              },
                            },
                          ],
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>

                <div className="form-field">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Select Start Time"
                      type="time"
                      required
                      value={bookingData.start_time ?? null}
                      onChange={(newDate) => {
                        console.log(
                          "Selected time:",
                          newDate,
                          "Is valid?",
                          newDate?.isValid()
                        );
                        setBookingData({
                          ...bookingData,
                          start_time: newDate,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="form-field">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Select End Time"
                      type="time"
                      required
                      value={bookingData.end_time ?? null}
                      onChange={(newDate) => {
                        console.log(
                          "Selected time:",
                          newDate,
                          "Is valid?",
                          newDate?.isValid()
                        );
                        setBookingData({
                          ...bookingData,
                          end_time: newDate,
                        });
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="form-field">
                  <label>Purpose:</label>
                  <input
                    type="text"
                    required
                    value={bookingData.purpose}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        purpose: e.target.value,
                      })
                    }
                  />
                </div>
                {isRoomAvailable() !== null && (
                  <div
                    style={{
                      marginTop: "1rem",
                      fontWeight: "bold",
                      color: isRoomAvailable() ? "green" : "red",
                    }}
                  >
                    {isRoomAvailable()
                      ? "✅ Room is available"
                      : "❌ Room is already booked at this time"}
                  </div>
                )}
                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit Booking
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div id="roomDetails" className="card shadow-sm mb-4">
          <div className="card-body p-0">
            <div
              style={{
                paddingTop: "1rem",
                paddingBottom: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "500px",
              }}
            >
              <img
                id="roomImage"
                src={
                  room.image
                    ? `http://127.0.0.1:8000${room.image}`
                    : "default-image.png"
                }
                alt="Room Image"
                className="img-fluid w-100"
                style={{
                  borderRadius: "0.5rem",
                  maxHeight: "100%",
                  maxWidth: "50%",
                  objectFit: "contain",
                }}
              />
              <div className="p-3">
                <div className="book-favorite">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      if (!user) return navigate("/login");
                      setShowModal(true);
                    }}
                  >
                    📅 Book Room
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`btn  ms-2 ${
                      isFavorite ? "btn-danger" : "btn-outline-danger"
                    }`}
                  >
                    {isFavorite ? "💖 Favorited" : "❤️ Favorite"}
                  </button>
                </div>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Building:</strong>{" "}
                    {buildingsList.find((b) => b.id === room.building)?.name ||
                      room.building}
                  </li>
                  <li className="list-group-item">
                    <strong>Room Number:</strong> {room.room_number || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Room Type:</strong> {room.room_type || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Capacity:</strong> {room.capacity || "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Projector:</strong>{" "}
                    {room.has_projector ? "Yes" : "No"}
                  </li>
                  <li className="list-group-item">
                    <strong>Air Conditioning:</strong>{" "}
                    {room.has_aircon ? "Yes" : "No"}
                  </li>
                  <li className="list-group-item">
                    <strong>TV:</strong> {room.has_tv ? "Yes" : "No"}
                  </li>
                  <li className="list-group-item">
                    <strong>Description:</strong> {room.description || "-"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Card (Separate card) */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Bookings for this room</h4>
            {bookings.length === 0 ? (
              <p className="text-center">No bookings found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">User</th>
                      <th scope="col">Start Time</th>
                      <th scope="col">End Time</th>
                      <th scope="col">Date</th>
                      <th scope="col">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}</th>
                        <td>{booking.booker_username || "N/A"}</td>
                        <td>
                          {new Date(
                            `1970-01-01T${booking.start_time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td>
                          {new Date(
                            `1970-01-01T${booking.end_time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td>
                          {new Date(booking.booking_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td>{booking.purpose || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {showPopup && (
        <div className="popup-backdrop" onClick={() => setShowPopup(false)}>
          <div className="popup-message" onClick={(e) => e.stopPropagation()}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)} className="">Close</button>
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

export default RoomDetails;
