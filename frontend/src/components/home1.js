import React, { useState } from "react";
import "../styles/home.css"; // Your CSS file
import "../styles/header.css";
import ruppLogo from "../assets/rupp_logo.png"; // Import the logo
import room1 from "../assets/room1.jpg"; // Import room images
import room2 from "../assets/room2.jpg";
import about from "./about";
import book from "./book";

function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const headerStyles = {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "2fr 4fr 1fr",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a10a0d",
    color: "white",
    padding: "1rem 0rem",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
  };
  const showPopup = () => {
    setIsPopupVisible(true);
    document.body.style.overflow = "hidden";
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
    document.body.style.overflow = "auto";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      alert("Login functionality would be implemented here!");
      hidePopup();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div>
      <header style={headerStyles}>
        <div className="logo_name">
          <a href="home" className="nav-logo">
            <img src={ruppLogo} alt="RUPP Logo" />
          </a>
          <span className="username-logo">Royal University Of Phnom Penh</span>
        </div>

        <nav className="top-nav" aria-label="Main navigation">
          <ul className="nav_list">
            <li className="nav_items">
              <a href="home" className="nav_link active-link">
                Home
              </a>
            </li>

            <li className="nav_items">
              <a href="book" className="nav_link">
                Books
              </a>
            </li>
            <li className="nav_items">
              <a href="ticket" className="nav_link">
                Ticket
              </a>
            </li>
            <li className="nav_items">
              <a href="setting" className="nav_link">
                Setting
              </a>
            </li>
            <li className="nav_items">
              <a href="about" className="nav_link">
                About
              </a>
            </li>
          </ul>
        </nav>

        <div className="icon">
          <a
            href="https://www.facebook.com/rupp.fe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg"
              alt="Visit our Facebook page"
            />
          </a>
          <a
            href="https://t.me/infoITE"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg"
              alt="Join our Telegram channel"
            />
          </a>
          <a
            href="https://maps.app.goo.gl/ef4p1kSyaUVba7c39"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlemaps.svg"
              alt="View us on Google Maps"
            />
          </a>

          <div className="booking">
            <button type="button" onClick={showPopup}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Popup overlay - show/hide based on state */}
      <div
        className="popup-overlay"
        style={{ display: isPopupVisible ? "block" : "none" }}
        onClick={hidePopup}
      ></div>

      {/* Popup - show/hide based on state */}
      <div
        className="popup"
        style={{ display: isPopupVisible ? "block" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close-btn" onClick={hidePopup}>
          &times;
        </div>
        <form className="form" onSubmit={handleFormSubmit}>
          <h2>Login</h2>
          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="yourname@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-element">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-element checkbox">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div className="form-element">
            <button type="submit">Sign in</button>
          </div>
          <div className="form-element">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>

      <main>
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {[
              {
                img: room1,
                title: "Conference Room A",
                desc: "Modern conference facility with capacity for 50 people. Equipped with latest technology for presentations and meetings.",
              },
              {
                img: room2,
                title: "Lecture Hall B",
                desc: "Spacious lecture hall accommodating up to 100 students. Perfect for academic presentations and seminars.",
              },
              {
                img: room1,
                title: "Study Room C",
                desc: "Quiet study environment for focused learning. Capacity for 20 people with individual study stations.",
              },
              {
                img: room2,
                title: "Main Auditorium",
                desc: "Grand auditorium with capacity for 200 attendees. Ideal for large events, ceremonies, and major presentations.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={item.img}
                  className="d-block w-100"
                  alt={item.title}
                />
                <div className="carousel-caption">
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>
                  <a href="#" className="btn btn-primary">
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
