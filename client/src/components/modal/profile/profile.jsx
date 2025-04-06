import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

import "./style.css";
import character from "../../../../public/assets/characters/character.png";
import alphabet from "../../../../public/assets/games/alphabet.png";

const GameProfile = ({ onClose, initialTab, username = "Cool Player" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeAvatar, setActiveAvatar] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const avatarOptions = [
    "../../../../public/assets/avatar/sheep.png",
    "../../../../public/assets/avatar/cow.png",
    "../../../../public/assets/avatar/cat.png",
    "../../../../public/assets/avatar/kitsune.png",
    "../../../../public/assets/avatar/owl.png",
    "../../../../public/assets/avatar/rhino.png",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const profile = await axios.get(
          "http://localhost:5000/api/v1/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setActiveAvatar(`../${profile.data.profile.avatar}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarChange = (newAvatar) => {
    // Normalize the avatar path by removing unnecessary "../"
    const normalizedAvatar = newAvatar.replace(/^(\.\.\/)+/, "");

    // Update the active avatar in the UI
    setActiveAvatar(normalizedAvatar);
    setShowAvatarOptions(false);

    // Send the updated avatar to the backend
    const updateAvatar = async () => {
      try {
        const token = Cookies.get("token"); // Get the authentication token
        const response = await axios.put(
          "http://localhost:5000/api/v1/profile/avatar",
          { avatar: normalizedAvatar }, // Send the avatar as part of the request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          console.log("Avatar updated successfully:", response.data.avatarUrl);
          window.location.reload();
        } else {
          console.error("Error updating avatar:", response.data.message);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error updating avatar:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    };

    updateAvatar();
  };

  const renderContent = () => {
    if (activeTab === "info") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Player Avatar Section */}
          <div className="avatar-section mb-4">
            <div className="avatar-container">
              <motion.img
                src={activeAvatar}
                alt="Player avatar"
                className="player-avatar"
                whileHover={{ scale: 1.05 }}
              />
              <motion.button
                className="change-avatar-btn"
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-grid-fill me-2"></i>
                Change Avatar
              </motion.button>
            </div>

            {showAvatarOptions && (
              <motion.div
                className="avatar-options"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {avatarOptions.map((avatarSrc, index) => (
                  <motion.img
                    key={index}
                    src={avatarSrc}
                    alt={`Avatar option ${index + 1}`}
                    className="avatar-option"
                    onClick={() => handleAvatarChange(avatarSrc)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Player Stats Card */}
          <div className="stats-card">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="stat-label">Total Games Played</h3>
              <div className="stat-value">247 🎮</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="stat-label">Achievements</h3>
              <div className="stat-value">23/50 🏆</div>
            </motion.div>
          </div>

          {/* Game Progress Card */}
          <div className="stats-card">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="stat-label">Current Level</h3>
              <div className="stat-value">99 ⭐</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="stat-label">Total Coins</h3>
              <div className="stat-value">100 🪙</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="stat-label">Characters Unlocked</h3>
              <div className="stat-value">4/12 🎭</div>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    if (activeTab === "history") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="history-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="d-flex align-items-center">
                <img src={alphabet} alt="alphabet" className="history-img" />
                <div className="history-content">
                  <h3>Alphabet Adventure</h3>
                  <p>
                    <i className="bi bi-star-fill text-warning"></i> Level:
                    16-20
                  </p>
                  <p>
                    <i className="bi bi-coin text-warning"></i> Coins: 100
                  </p>
                  <p>🎯Score: 100</p>
                  <p>
                    <i className="bi bi-calendar3"></i> Date: 12/23/24
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    if (activeTab === "characters") {
      return (
        <motion.div
          className="character-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className="character-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.img
                src={character}
                alt={`Character ${index + 1}`}
                className="character-img"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <h3 className="stat-label">Character {index + 1}</h3>
              <motion.button
                className="use-character-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-person-check me-2"></i>
                Use Character
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="modal-full"
    >
      <motion.div
        className="profile-card w-100 h-100"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="profile-header">
          <div className="d-flex justify-content-between align-items-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {username}'s Profile 🌟
            </motion.h2>
            <motion.button
              className="profile-close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Close
            </motion.button>
          </div>
        </div>

        <div className="scrollable">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-12 mb-4">
                <motion.button
                  className={`tab-button ${
                    activeTab === "info" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("info")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Info
                </motion.button>
                <motion.button
                  className={`tab-button ${
                    activeTab === "history" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  History
                </motion.button>
                <motion.button
                  className={`tab-button ${
                    activeTab === "characters" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("characters")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="bi bi-people me-2"></i>
                  Characters
                </motion.button>
              </div>

              <div className="col-md-8 col-12">{renderContent()}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameProfile;
