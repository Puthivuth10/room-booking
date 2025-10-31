import React, { useState, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/header.css";
import "../styles/setting.css";
import ruppLogo from "../assets/rupp_logo.png";

function SidebarItem({ name, iconClass, activeSection, setActiveSection }) {
  const isActive = activeSection === name;
  return (
    <li
      className={isActive ? "active" : ""}
      onClick={() => setActiveSection(name)}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") setActiveSection(name);
      }}
      aria-pressed={isActive}
      aria-current={isActive ? "page" : undefined}
    >
      <i className={`bx ${iconClass}`} />
      {name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </li>
  );
}

function AccountItem({ accountName, email, onDisconnect }) {
  if (!email) return <p>{accountName} account disconnected.</p>;

  return (
    <div className="account-item">
      <i className={`bx bxl-${accountName.toLowerCase()}`} />
      <div>
        <strong>
          {accountName.charAt(0).toUpperCase() + accountName.slice(1)}
        </strong>
        <p>{email}</p>
      </div>
      <button
        className="disconnect-btn"
        onClick={() => {
          if (
            window.confirm(
              `Are you sure you want to disconnect ${accountName}?`
            )
          ) {
            onDisconnect();
          }
        }}
        aria-label={`Disconnect ${accountName}`}
      >
        Disconnect
      </button>
    </div>
  );
}

function DeviceItem({ id, name, location, onDisconnect }) {
  const iconClass = name.toLowerCase().includes("iphone")
    ? "bx-mobile-alt"
    : "bx-laptop";

  return (
    <div className="device-item">
      <i className={`bx ${iconClass}`} />
      <div>
        <strong>{name}</strong>
        <p>{location}</p>
      </div>
      <button
        className="disconnect-btn"
        onClick={() => {
          if (
            window.confirm(
              `Are you sure you want to disconnect device ${name}?`
            )
          ) {
            onDisconnect(id);
          }
        }}
        aria-label={`Disconnect device ${name}`}
      >
        Disconnect
      </button>
    </div>
  );
}

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("personal-info");

  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preference, setPreference] = useState({
    theme: "light",
    language: "English",
  });
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: "hour.sovandath.3625@rupp.edu.kh",
    facebook: "hour.sovandath.3625@rupp.edu.kh",
  });
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: "G7I3PU", location: "Phnom Penh, Cambodia" },
    { id: 2, name: "iPhone 11 Pro Max", location: "Phnom Penh, Cambodia" },
  ]);

  // Handler factory for input changes
  const handleInputChange = useCallback(
    (setter) => (e) => {
      const { name, value } = e.target;
      setter((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const updatePersonalInfo = useCallback(() => {
    if (!personalInfo.name.trim() || !personalInfo.email.trim()) {
      alert("Please enter valid name and email.");
      return;
    }
    alert(
      `Personal Info updated:\nName: ${personalInfo.name}\nEmail: ${personalInfo.email}`
    );
  }, [personalInfo]);

  const updatePassword = useCallback(() => {
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }
    alert("Password updated successfully.");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  }, [passwords]);

  const updatePreference = useCallback(() => {
    alert(
      `Preferences updated:\nTheme: ${preference.theme}\nLanguage: ${preference.language}`
    );
  }, [preference]);

  const disconnectAccount = useCallback((account) => {
    setConnectedAccounts((prev) => ({ ...prev, [account]: null }));
    alert(
      `${account.charAt(0).toUpperCase() + account.slice(1)} disconnected.`
    );
  }, []);

  const disconnectDevice = useCallback((id) => {
    setConnectedDevices((prev) => prev.filter((device) => device.id !== id));
    alert("Device disconnected.");
  }, []);

  return (
    <div className="settings-page">
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
                  Ticket
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/setting" className="nav_link active-link">
                  Setting
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/about" className="nav_link">
                  About
                </Link>
              </li>
              <li className="nav_items username-item">
                <span className="username">Mr. Username</span>
              </li>
            </ul>
          </div>
          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-menu" />
          </div>
        </nav>
      </header>

      <main className="settings-container">
        <nav className="settings-sidebar" aria-label="Settings Navigation">
          <h2>Settings</h2>
          <ul>
            <SidebarItem
              name="personal-info"
              iconClass="bx-user"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <SidebarItem
              name="change-password"
              iconClass="bx-lock-alt"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <SidebarItem
              name="preference"
              iconClass="bx-cog"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <SidebarItem
              name="connected-accounts"
              iconClass="bx-link-alt"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <SidebarItem
              name="devices"
              iconClass="bx-devices"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </ul>
        </nav>

        <section className="settings-content" aria-live="polite">
          {activeSection === "personal-info" && (
            <>
              <h3>My Profile Picture</h3>
              <div className="profile-picture">
                <div className="avatar-placeholder">
                  <i className="bx bx-user" />
                </div>
                <button
                  className="change-btn"
                  onClick={() => alert("Change profile picture clicked!")}
                >
                  Change
                </button>
              </div>

              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={personalInfo.name}
                  onChange={handleInputChange(setPersonalInfo)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handleInputChange(setPersonalInfo)}
                />
              </div>
              <button
                onClick={updatePersonalInfo}
                className="change-btn"
                disabled={
                  !personalInfo.name.trim() || !personalInfo.email.trim()
                }
              >
                Update
              </button>
            </>
          )}

          {activeSection === "change-password" && (
            <>
              <h3>Change Password</h3>
              <div className="form-group">
                <label htmlFor="oldPassword">Old Password</label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwords.oldPassword}
                  onChange={handleInputChange(setPasswords)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handleInputChange(setPasswords)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handleInputChange(setPasswords)}
                />
              </div>
              {passwords.newPassword !== passwords.confirmPassword && (
                <p style={{ color: "red" }}>Passwords do not match!</p>
              )}
              <button
                onClick={updatePassword}
                className="change-btn"
                disabled={
                  !passwords.oldPassword ||
                  !passwords.newPassword ||
                  !passwords.confirmPassword ||
                  passwords.newPassword !== passwords.confirmPassword
                }
              >
                Update
              </button>
            </>
          )}

          {activeSection === "preference" && (
            <>
              <h3>Preference</h3>
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  name="theme"
                  value={preference.theme}
                  onChange={handleInputChange(setPreference)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  name="language"
                  value={preference.language}
                  onChange={handleInputChange(setPreference)}
                >
                  <option value="English">English</option>
                  <option value="Khmer">Khmer</option>
                </select>
              </div>
              <button className="change-btn" onClick={updatePreference}>
                Update
              </button>
            </>
          )}

          {activeSection === "connected-accounts" && (
            <>
              <h3>Connected Accounts</h3>
              <AccountItem
                accountName="google"
                email={connectedAccounts.google}
                onDisconnect={() => disconnectAccount("google")}
              />
              <AccountItem
                accountName="facebook"
                email={connectedAccounts.facebook}
                onDisconnect={() => disconnectAccount("facebook")}
              />
            </>
          )}

          {activeSection === "devices" && (
            <>
              <h3>Devices</h3>
              {connectedDevices.length === 0 && <p>No connected devices.</p>}
              {connectedDevices.map(({ id, name, location }) => (
                <DeviceItem
                  key={id}
                  id={id}
                  name={name}
                  location={location}
                  onDisconnect={disconnectDevice}
                />
              ))}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
