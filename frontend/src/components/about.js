
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/header.css";
import "../styles/about.css";
import "boxicons/css/boxicons.min.css";
import ruppLogo from "../assets/rupp_logo.png";
import React, { useEffect, useState } from "react";
const About = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
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
    <div className="about-page">
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
                <Link to="/book" className="nav_link">
                  Books
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/ticket" className="nav_link">
                  Tickets
                </Link>
              </li>
              {/* <li className="nav_items">
                <Link to="/setting" className="nav_link">
                  Setting
                </Link>
              </li> */}
              <li className="nav_items">
                <Link to="/about" className="nav_link active-link">
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

      <main className="about-container">
        <section className="about-section">
          <div className="about-content">
            <h1>About Us</h1>
            <p>
              Welcome to the University Room Booking system designed exclusively
              for our esteemed faculty members.
            </p>
            <p>
              This platform allows teachers to conveniently book available
              university rooms for:
            </p>

            <ul className="about-features">
              <li>
                <i className="bx bx-check-circle"></i> Meetings and
                consultations
              </li>
              <li>
                <i className="bx bx-check-circle"></i> Teaching or Research
                Sessions
              </li>
              <li>
                <i className="bx bx-check-circle"></i> Small Group Activities or
                Tutorials
              </li>
              <li>
                <i className="bx bx-check-circle"></i> Departmental or
                administrative use
              </li>
            </ul>

            <p>
              Our goal is to streamline the reservation process and ensure fair
              access to shared academic spaces.
            </p>
            <div className="contact-info">
              <h2>Contact Us</h2>
              <p>
                <i className="bx bx-envelope"></i> email@example.com
              </p>
              <p>
                <i className="bx bx-map"></i> Room 101, Admin Building
              </p>
            </div>
          </div>
        </section>
      </main>

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
export default About;
