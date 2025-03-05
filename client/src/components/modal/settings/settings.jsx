import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import "./style.css";

const GameSettings = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`modal-full ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <motion.div
        className="settings-card"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="settings-header">
          <div className="d-flex justify-content-between align-items-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Game Settings ⚙️
            </motion.h2>
            <motion.button
              className="settings-close-btn"
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Close
            </motion.button>
          </div>
        </div>

        <div className="settings-content">
          {/* Sound Settings */}
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3>Sound Settings 🔊</h3>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <button
                className="settings-btn btn-sound"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <i
                  className={`bi bi-volume-${soundEnabled ? "up" : "mute"}`}
                ></i>
                Sound Effects
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={() => setSoundEnabled(!soundEnabled)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <button
                className="settings-btn btn-music"
                onClick={() => setMusicEnabled(!musicEnabled)}
              >
                <i
                  className={`bi bi-music-note-${
                    musicEnabled ? "beamed" : "x"
                  }`}
                ></i>
                Background Music
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={musicEnabled}
                    onChange={() => setMusicEnabled(!musicEnabled)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </button>
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Theme Settings 🎨</h3>
            <button className="settings-btn btn-theme" onClick={toggleTheme}>
              <i
                className={`bi bi-${theme === "light" ? "sun" : "moon-stars"}`}
              ></i>
              {theme === "light" ? "Light Theme" : "Dark Theme"}
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
                <span className="toggle-slider"></span>
              </label>
            </button>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Account Settings 👤</h3>
            <button className="settings-btn btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              Log Out
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameSettings;
