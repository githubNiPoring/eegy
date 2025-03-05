import { motion } from "framer-motion";
import "./style.css";
import trophy from "../../../assets/trophy.png";

const GameAchievements = ({ onClose }) => {
  const achievements = [
    {
      id: 1,
      name: "Word Master",
      description:
        "Learn 50 new words! You're becoming a vocabulary champion! 📚",
      progress: 80,
      status: "40/50 words",
      image: trophy,
      badge: "Almost there! 🌟",
    },
    {
      id: 2,
      name: "Alphabet Hero",
      description:
        "Master all the letters of the alphabet! You're doing great! 🔤",
      progress: 100,
      status: "Completed!",
      image: trophy,
      badge: "Completed! 🏆",
    },
    {
      id: 3,
      name: "Spelling Wizard",
      description:
        "Cast your spelling magic and get 10 words right in a row! ✨",
      progress: 30,
      status: "3/10 streak",
      image: trophy,
      badge: "Keep going! 💫",
    },
    {
      id: 4,
      name: "Reading Explorer",
      description: "Unlock this achievement by reading your first story! 📖",
      progress: 0,
      status: "Locked",
      image: trophy,
      badge: "Coming soon! 🔒",
      locked: true,
    },
  ];

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
                        fontFamily: "'Comic Sans MS', cursive",
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
                  {achievements.map((achievement, index) => (
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
                        whileHover={!achievement.locked ? { scale: 1.03 } : {}}
                        whileTap={!achievement.locked ? { scale: 0.98 } : {}}
                      >
                        <div className="achievement-badge">
                          {achievement.badge}
                        </div>
                        <div className="text-center">
                          <motion.img
                            src={achievement.image}
                            className="achievement-image"
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
                            <div className="achievement-progress">
                              <div
                                className="progress-bar"
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                            <p className="achievement-status">
                              {achievement.status}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
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
