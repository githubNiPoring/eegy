import { motion } from "framer-motion";
import "./style.css";
import trophy from "../../../../public/assets/misc/trophy.png";

import { useState } from "react";
import React, { useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const GameAchievements = ({ onClose }) => {
  const [gameAchievements, setGameAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/achievements/`);
      console.log("Achievements fetched:", response.data.achievements);
      setGameAchievements(response.data.achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      // Handle error appropriately, e.g., show a notification or log it
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="modal-full"
    >
      <motion.div
        className="achievements-card card w-100 h-100"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="achievements-header">
          <div className="d-flex justify-content-between align-items-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Achievements 🏆
            </motion.h2>
            <motion.button
              className="close-btn"
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
              <motion.div
                className="col-md-4 col-12 mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center">
                  <motion.img
                    src={trophy}
                    alt="trophy"
                    className="trophy-main"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3
                      style={{
                        color: "#663300",
                        fontFamily: "Comic Sans MS",
                        marginTop: "20px",
                        textShadow: "1px 1px 0 #fff",
                      }}
                    >
                      Keep Learning!
                    </h3>
                    <p className="text-muted">
                      Collect stars and earn rewards! ⭐
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <div className="col-md-8 col-12">
                <div className="row g-4">
                  {gameAchievements && gameAchievements.length > 0 ? (
                    gameAchievements.map((achievement, index) => {
                      return (
                        <motion.div
                          key={achievement.id}
                          className="col-12 col-sm-6"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * (index + 1) }}
                        >
                          <motion.div
                            className={`achievement-item ${
                              achievement.locked ? "achievement-locked" : ""
                            }`}
                            whileHover={
                              !achievement.locked ? { scale: 1.03 } : {}
                            }
                            whileTap={
                              !achievement.locked ? { scale: 0.98 } : {}
                            }
                          >
                            <div className="achievement-badge">
                              {achievement.category}
                            </div>
                            <div className="text-center">
                              <motion.img
                                src={achievement.iconUrl}
                                className="achievement-image mt-5"
                                alt={achievement.name}
                                animate={
                                  !achievement.locked
                                    ? {
                                        rotate: [0, 5, 0],
                                        y: [0, -5, 0],
                                      }
                                    : {}
                                }
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                              <div className="achievement-details">
                                <h4 className="achievement-name">
                                  {achievement.name}
                                </h4>
                                <p className="achievement-description">
                                  {achievement.description}
                                </p>

                                <p className="achievement-status">
                                  {achievement.status}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center">
                      <p className="text-muted">No achievements found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameAchievements;
