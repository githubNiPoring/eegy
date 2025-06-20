import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

import "./style.css";
import alphabet from "../../../../public/assets/games/word_buddy.png";
import coin from "../../../../public/assets/misc/coin.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const GameProfile = ({ onClose, initialTab, username = "Cool Player" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeAvatar, setActiveAvatar] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [userHistoryCount, setUserHistoryCount] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [countAchievements, setCountAchievements] = useState(0);

  const avatarOptions = [
    "../../../../public/assets/avatar/player.jpg",
    "../../../../public/assets/avatar/sheep.png",
    "../../../../public/assets/avatar/cow.png",
    "../../../../public/assets/avatar/cat.png",
    "../../../../public/assets/avatar/kitsune.png",
    "../../../../public/assets/avatar/owl.png",
    "../../../../public/assets/avatar/rhino.png",
  ];

  const fetchCountAchievements = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${BASE_URL}/api/v1/achievements/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountAchievements(response.data.count);
    } catch (error) {
      console.error("Error fetching achievements count:", error);
    }
  };
  useEffect(() => {
    fetchCountAchievements();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/api/v1/history/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Game history fetched:", response.data);
      const sortedHistory = response.data.data.sort((a, b) => {
        // Convert dates to Date objects for proper comparison
        const dateA = new Date(a.datePlayed || 0);
        const dateB = new Date(b.datePlayed || 0);
        return dateB - dateA; // Latest first (descending order)
      });

      setUserHistory(sortedHistory);
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/history/user-game-history-count`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setUserHistoryCount(response.data.count);

      const userProfile = await axios.get(`${BASE_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      console.log("User profile fetched:", userProfile.data.profile);
      setCurrentLevel(userProfile.data.profile.userLevel);
      setTotalCoins(userProfile.data.profile.coins);
      setAccumulatedScore(userProfile.data.profile.cumulativeScore);
    } catch (error) {
      console.error("Error fetching game history count:", error);
    }
  };
  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const profile = await axios.get(`${BASE_URL}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setActiveAvatar(`../${profile.data.profile.avatar}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const availableCharacters = await axios.get(
          `${BASE_URL}/api/v1/characters/bought`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const charIds = availableCharacters.data.boughtCharacters.map(
          (character) => character.charID
        );

        const characterPromises = charIds.map((id) =>
          axios.get(`${BASE_URL}/api/v1/characters/${id}`)
        );

        const characterResponses = await Promise.all(characterPromises);

        const characterData = characterResponses.map(
          (response) => response.data
        );

        setCharacters(characterData);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  const handleAvatarChange = (newAvatar) => {
    const normalizedAvatar = newAvatar.replace(/^(\.\.\/)+/, "");

    // Update the active avatar in the UI
    setActiveAvatar(normalizedAvatar);
    setShowAvatarOptions(false);

    // Send the updated avatar to the backend
    const updateAvatar = async () => {
      try {
        const token = Cookies.get("token"); // Get the authentication token
        const response = await axios.put(
          `${BASE_URL}/api/v1/profile/avatar`,
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

  const handleUseCharacter = async (charID) => {
    try {
      console.log("Selected Character ID:", charID);
      const token = Cookies.get("token");
      const updateCharcter = await axios.post(
        `${BASE_URL}/api/v1/characters/update/${charID}`,
        {}, // Empty body or send data if needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Error using character:", error);
    }
  };

  // Helper function to get background color based on score
  const getHistoryItemStyle = (score) => {
    const numericScore = score || 0;
    if (numericScore < 100) {
      return {
        backgroundColor: "#ffebee", // Light red background for incomplete
        borderLeft: "4px solid #dc3545", // Red left border accent
      };
    }
    return {
      backgroundColor: "#fff8e1", // Light yellow/cream background for complete (or keep default)
      borderLeft: "4px solid #28a745", // Green left border accent
    };
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
              <div className="stat-value">{userHistoryCount} 🎮</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="stat-label">Achievements</h3>
              <div className="stat-value">{countAchievements}/15 🏆</div>
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
              <div className="stat-value">{currentLevel} ⭐</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="stat-label">Total Coins</h3>
              <div className="stat-value">
                {totalCoins}{" "}
                <img
                  src={coin}
                  className="coin-logo"
                  alt="coin"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                    marginBottom: "8px",
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
                  }}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="stat-label">Accumulated Score</h3>
              <div className="stat-value">{accumulatedScore} 🎯</div>
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
          {userHistory && userHistory.length > 0 ? (
            userHistory.map((historyItem, index) => {
              const historyStyle = getHistoryItemStyle(historyItem.score);

              return (
                <motion.div
                  key={index}
                  className="history-item"
                  style={historyStyle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={historyItem.gameImage || alphabet}
                      alt={historyItem.gameName || "game"}
                      className="history-img"
                    />
                    <div className="history-content">
                      <h3>{historyItem.gameName || "Game Name"}</h3>
                      <p>
                        <i className="bi bi-star-fill text-warning"></i> Level:{" "}
                        {historyItem.lvlReached || "N/A"}
                      </p>
                      <p>
                        <i className="bi bi-coin text-warning"></i> Coins:{" "}
                        {historyItem.earnedCoin || 0}
                      </p>
                      <p>
                        🎯Score: {historyItem.score || 0}
                        {historyItem.score < 100 && (
                          <span
                            style={{
                              fontSize: "0.85em",
                              marginLeft: "8px",
                              color: "#dc3545",
                            }}
                          >
                            (Incomplete -{" "}
                            {10 - Math.floor((historyItem.score || 0) / 10)}{" "}
                            questions remaining)
                          </span>
                        )}
                      </p>
                      <p>
                        <i className="bi bi-calendar3"></i> Date:{" "}
                        {historyItem.datePlayed || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-5">
              <p>No game history found. Please check back later!</p>
            </div>
          )}
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
          {characters.map((character, index) => (
            <motion.div
              key={index}
              className="character-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.img
                src={character.character.charImg}
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
              <h3 className="stat-label">
                {character.character.characterName}
              </h3>
              <motion.button
                className="use-character-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUseCharacter(character.character.charID)}
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
