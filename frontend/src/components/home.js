import React, { useEffect, useState } from "react";
import ruppLogo from "../assets/rupp_logo.png"; // Import the logo
import room1 from "../assets/room1.jpg"; // Import room images
import room2 from "../assets/room2.jpg";
import "../styles/header.css";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";


function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [hoverStates, setHoverStates] = useState({ loginBtn: false });
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showLogin) {
      showPopup();
    }
  }, [location]);


  // All CSS styles converted to JavaScript objects
  const styles = {
    // Global styles
    body: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      height: "100%",
      width: "100%",
      overflowX: "hidden",
      backgroundColor: "white",
      color: "black",
      lineHeight: 1.5,
    },

    // Header styles
    header: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "2fr 4fr 1fr",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#a10a0d",
      color: "white",
      padding: "1rem 0rem",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
    },

    // Logo + School name
    logoName: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      paddingLeft: "2rem",
    },

    logoImg: {
      height: "60px",
      width: "auto",
      verticalAlign: "middle",
    },

    usernameLogo: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "white",
      whiteSpace: "nowrap",
    },

    // Top Navigation
    topNav: {
      marginTop: "5px",
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      width: "100%",
    },

    navList: {
      display: "flex",
      listStyle: "none",
      gap: "1.5rem",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },

    navLink: {
      color: "white",
      textDecoration: "none",
      transition: "all 0.3s",
      fontWeight: 500,
      fontSize: "1.1rem",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
    },

    navLinkHover: {
      color: "red",
      textDecoration: "underline",
    },

    navLinkActive: {
      color: "white",
      // textDecoration: "none",
      transition: "all 0.3s",
      fontWeight: 600,
      fontSize: "1.1rem",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
      textDecoration: "underline",
    },

    navLinkActiveHover: {
      color: "red",
      textDecoration: "underline",
    },
    // Icon Section
    icon: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      paddingRight: "2rem",
      paddingLeft: "2rem",
    },

    iconImg: {
      width: "32px",
      height: "32px",
      transition: "transform 0.3s",
      filter: "brightness(0) invert(1)",
    },

    iconImgHover: {
      transform: "scale(1.2)",
    },

    // Login Button
    bookingButton: {
      padding: "10px 20px",
      backgroundColor: "#ffffff",
      color: "#a10a0d",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s",
      borderRadius: "25px",
      marginLeft: "15px",
    },

    bookingButtonHover: {
      backgroundColor: "#f0f0f0",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },

    // Main content
    main: {
      height: "calc(100vh - 92px)",
      overflow: "hidden",
    },

    // Carousel styles
    carousel: {
      width: "100%",
      height: "100vh",
      alignItems: "center",
    },

    carouselInner: {
      width: "100%",
      height: "100vh",
      alignItems: "center",
      position: "relative",
    },

    carouselItem: {
      width: "100%",
      height: "100vh",
      alignItems: "center",
      display: "none",
      position: "relative",
    },

    carouselItemActive: {
      width: "100%",
      height: "100vh",
      alignItems: "center",
      display: "block",
      position: "relative",
    },

    carouselImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    // Carousel overlay content
    carouselCaption: {
      alignContent: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      background: "rgba(0, 0, 0, 0.7)",
      padding: "2rem",
      borderRadius: "15px",
      backdropFilter: "blur(10px)",
      width: "50%",
      color: "white",
    },

    carouselCaptionH2: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    },

    carouselCaptionP: {
      fontSize: "1.3rem",
      marginBottom: "2rem",
      opacity: 0.9,
    },

    carouselBtn: {
      padding: "1rem 2rem",
      backgroundColor: "#a10a0d",
      color: "white",
      border: "none",
      borderRadius: "25px",
      fontSize: "1.1rem",
      textDecoration: "none",
      display: "inline-block",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "1px",
      cursor: "pointer",
    },

    carouselBtnHover: {
      backgroundColor: "#8a0808",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },

    // Custom carousel controls
    carouselControl: {
      width: "50px",
      height: "50px",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      backdropFilter: "blur(10px)",
      border: "2px solid white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      color: "white",
    },

    carouselControlPrev: {
      left: "30px",
    },

    carouselControlNext: {
      right: "30px",
    },

    carouselControlHover: {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },

    // Login Popup
    popupOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "none",
      zIndex: 1500,
    },

    popup: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      display: "none",
      zIndex: 1501,
      minWidth: "500px",
    },

    closeBtn: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "2rem",
      cursor: "pointer",
      color: "#999",
      transition: "color 0.3s",
    },

    closeBtnHover: {
      color: "#333",
    },

    formH2: {
      marginBottom: "1.5rem",
      color: "#a10a0d",
      textAlign: "center",
    },

    formElement: {
      marginBottom: "1rem",
    },

    formLabel: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: 500,
      color: "#333",
    },

    formInput: {
      width: "100%",
      padding: "0.8rem",
      border: "2px solid #ddd",
      borderRadius: "5px",
      fontSize: "1rem",
      transition: "border-color 0.3s",
      boxSizing: "border-box",
    },

    formInputFocus: {
      outline: "none",
      borderColor: "#a10a0d",
    },

    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    checkboxInput: {
      width: "auto",
    },

    formButton: {
      width: "100%",
      padding: "1rem",
      backgroundColor: "#a10a0d",
      color: "white",
      border: "none",
      borderRadius: "5px",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },

    formButtonHover: {
      backgroundColor: "#8a0808",
    },

    formLink: {
      color: "#a10a0d",
      textDecoration: "none",
      fontSize: "0.9rem",
    },

    formLinkHover: {
      textDecoration: "underline",
    },
  };

  // State for current carousel slide
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [hoverStates, setHoverStates] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleMouseEnter = (elementId) => {
    setHoverStates((prev) => ({ ...prev, [elementId]: true }));
  };
  const handleMouseLeave = (elementId) => {
    setHoverStates((prev) => ({ ...prev, [elementId]: false }));
  };

  const showPopup = () => {
    setIsPopupVisible(true);
    setLoginError(null);
    setLoginSuccess(false);
    document.body.style.overflow = "hidden";
  };
  const hidePopup = () => {
    setIsPopupVisible(false);
    document.body.style.overflow = "auto";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Now call the user info endpoint
      const userRes = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!userRes.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userRes.json();
      localStorage.setItem("username", userData.username); // Save for later use

      setLoginSuccess(true);
      setLoginError(null);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = "/book"; // Or your desired redirect path
      }, 1000);
    } catch (err) {
      setLoginError(err.message);
      setLoginSuccess(false);
    }
  };

  const carouselData = [
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
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <div style={styles.logoName}>
          <a href="home" className="nav-logo">
            <img src={ruppLogo} alt="RUPP Logo" style={styles.logoImg} />
          </a>
          <span style={styles.usernameLogo}>
            Royal University Of Phnom Penh
          </span>
        </div>

        <nav style={styles.topNav} aria-label="Main navigation">
          <ul style={styles.navList} className="nav_list">
            <li>
              <a
                href="home"
                style={{
                  ...styles.navLinkActive,
                  ...(hoverStates.home ? styles.navLinkActiveHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("home")}
                onMouseLeave={() => handleMouseLeave("home")}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="book"
                style={{
                  ...styles.navLink,
                  ...(hoverStates.book ? styles.navLinkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("book")}
                onMouseLeave={() => handleMouseLeave("book")}
              >
                Books
              </a>
            </li>
            <li>
              <a
                href="ticket"
                style={{
                  ...styles.navLink,
                  ...(hoverStates.ticket ? styles.navLinkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("ticket")}
                onMouseLeave={() => handleMouseLeave("ticket")}
              >
                Ticket
              </a>
            </li>
            {/* <li>
              <a
                href="setting"
                style={{
                  ...styles.navLink,
                  ...(hoverStates.setting ? styles.navLinkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("setting")}
                onMouseLeave={() => handleMouseLeave("setting")}
              >
                Setting
              </a>
            </li> */}
            <li>
              <a
                href="about"
                style={{
                  ...styles.navLink,
                  ...(hoverStates.about ? styles.navLinkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={() => handleMouseLeave("about")}
              >
                About
              </a>
            </li>
          </ul>
        </nav>

        <div style={styles.icon}>
          <a
            href="https://www.facebook.com/rupp.fe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg"
              alt="Visit our Facebook page"
              style={{
                ...styles.iconImg,
                ...(hoverStates.facebook ? styles.iconImgHover : {}),
              }}
              onMouseEnter={() => handleMouseEnter("facebook")}
              onMouseLeave={() => handleMouseLeave("facebook")}
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
              style={{
                ...styles.iconImg,
                ...(hoverStates.telegram ? styles.iconImgHover : {}),
              }}
              onMouseEnter={() => handleMouseEnter("telegram")}
              onMouseLeave={() => handleMouseLeave("telegram")}
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
              style={{
                ...styles.iconImg,
                ...(hoverStates.maps ? styles.iconImgHover : {}),
              }}
              onMouseEnter={() => handleMouseEnter("maps")}
              onMouseLeave={() => handleMouseLeave("maps")}
            />
          </a>

          <div className="booking">
            {!user && (
              <button
                type="button"
                onClick={showPopup}
                style={{
                  ...styles.bookingButton,
                  ...(hoverStates.loginBtn ? styles.bookingButtonHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter("loginBtn")}
                onMouseLeave={() => handleMouseLeave("loginBtn")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Popup overlay - show/hide based on state */}
      <div
        style={{
          ...styles.popupOverlay,
          display: isPopupVisible ? "block" : "none",
        }}
        onClick={hidePopup}
      ></div>

      {/* Popup - show/hide based on state */}
      <div
        style={{
          ...styles.popupOverlay,
          display: isPopupVisible ? "block" : "none",
        }}
        onClick={hidePopup}
      ></div>

      <div
        style={{
          ...styles.popup,
          display: isPopupVisible ? "block" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...styles.closeBtn,
            ...(hoverStates.closeBtn ? styles.closeBtnHover : {}),
          }}
          onClick={hidePopup}
          onMouseEnter={() => handleMouseEnter("closeBtn")}
          onMouseLeave={() => handleMouseLeave("closeBtn")}
        >
          &times;
        </div>
        <form onSubmit={handleFormSubmit}>
          <h2 style={styles.formH2}>Login</h2>
          {loginError && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
              Error: {loginError}
            </div>
          )}
          {loginSuccess && (
            <div style={{ color: "green", marginBottom: "1rem" }}>
              Login successful! Redirecting...
            </div>
          )}
          <div style={styles.formElement}>
            <label htmlFor="username" style={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              autoComplete="username"
              required
              style={styles.formInput}
            />
          </div>
          <div style={styles.formElement}>
            <label htmlFor="password" style={styles.formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              required
              style={styles.formInput}
            />
          </div>
          {/* <div style={{...styles.formElement, ...styles.checkbox}}>
            <input type="checkbox" id="remember-me" name="remember_me" style={styles.checkboxInput} />
            <label htmlFor="remember-me" style={styles.formLabel}>Remember me</label>
          </div> */}
          <div style={styles.formElement}>
            <button
              type="submit"
              style={{
                ...styles.formButton,
                ...(hoverStates.submitBtn ? styles.formButtonHover : {}),
              }}
              onMouseEnter={() => handleMouseEnter("submitBtn")}
              onMouseLeave={() => handleMouseLeave("submitBtn")}
            >
              Sign in
            </button>
          </div>
          <div style={styles.formElement}>Forgot Password? Contact Admin!!</div>
        </form>
      </div>

      <main style={styles.main}>
        <div style={styles.carousel}>
          <div style={styles.carouselInner}>
            {carouselData.map((item, index) => (
              <div
                key={index}
                style={
                  index === currentSlide
                    ? styles.carouselItemActive
                    : styles.carouselItem
                }
              >
                <img
                  src={item.img}
                  style={styles.carouselImg}
                  alt={item.title}
                />
                <div style={styles.carouselCaption}>
                  <h2 style={styles.carouselCaptionH2}>{item.title}</h2>
                  <p style={styles.carouselCaptionP}>{item.desc}</p>
                  <a
                    href="/"
                    style={{
                      ...styles.carouselBtn,
                      ...(hoverStates[`bookBtn${index}`]
                        ? styles.carouselBtnHover
                        : {}),
                    }}
                    onMouseEnter={() => handleMouseEnter(`bookBtn${index}`)}
                    onMouseLeave={() => handleMouseLeave(`bookBtn${index}`)}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.carouselControl,
              ...styles.carouselControlPrev,
              ...(hoverStates.prevBtn ? styles.carouselControlHover : {}),
            }}
            type="button"
            onClick={prevSlide}
            onMouseEnter={() => handleMouseEnter("prevBtn")}
            onMouseLeave={() => handleMouseLeave("prevBtn")}
          >
            &#8249;
          </button>

          <button
            style={{
              ...styles.carouselControl,
              ...styles.carouselControlNext,
              ...(hoverStates.nextBtn ? styles.carouselControlHover : {}),
            }}
            type="button"
            onClick={nextSlide}
            onMouseEnter={() => handleMouseEnter("nextBtn")}
            onMouseLeave={() => handleMouseLeave("nextBtn")}
          >
            &#8250;
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
