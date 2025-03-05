import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import "./style.css";
import alphabet from "../../../assets/games/alphabet.png";
import word_buddy from "../../../assets/games/word_buddy.png";
import kid_wordle from "../../../assets/games/kid_wordle.png";

const PlayGame = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const games = [
    {
      title: "Word Buddy",
      image: word_buddy,
      path: "/word-buddy",
      description:
        "Make new friends while learning exciting new words! Perfect for young learners.",
      badge: "Easy 🌟",
      emoji: "📚",
    },
    {
      title: "Alphabet Adventure",
      image: alphabet,
      path: "/alphabet",
      description:
        "Join a magical journey through the alphabet kingdom. Learn letters in a fun way!",
      badge: "Intermmediate ✨",
      emoji: "🔤",
    },
    {
      title: "Kid Wordle",
      image: kid_wordle,
      path: "/kid-wordle",
      description:
        "Can you guess the secret word? A fun word guessing game for clever minds!",
      badge: "Hard 🎯",
      emoji: "🎲",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{
        duration: 0.3,
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      className="modal-container"
    >
      <div className="card" data-theme={theme}>
        <div className="card-body">
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-x-circle me-2"></i>
            Close
          </motion.button>

          <div className="game-selection-container">
            <motion.div
              className="text-center mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="game-selection-title">
                Choose Your Adventure! 🎮
              </h2>
              <p className="game-selection-subtitle">
                Pick a fun game and start learning! 🌈
              </p>
            </motion.div>

            <div className="games-grid">
              {games.map((game, index) => (
                <motion.div
                  key={game.title}
                  className="game-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <motion.div
                    className="game-card-content"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(game.path)}
                  >
                    <div className="game-badge">{game.badge}</div>
                    <div className="game-image-container">
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                          rotate: [0, 3, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <img
                          src={game.image}
                          className="game-image"
                          alt={game.title}
                        />
                      </motion.div>
                    </div>
                    <h3 className="game-title">
                      {game.emoji} {game.title}
                    </h3>
                    <p className="game-description">{game.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayGame;
