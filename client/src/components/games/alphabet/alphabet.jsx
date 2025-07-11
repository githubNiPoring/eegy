import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { playSoundEffect } from "../../../hooks/useAudio";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import GameOver from "../../modal/game-over/gameover";
import Congratulation from "../../modal/congratulations/congratulations";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { usePlaySoundEffect } from "../../../hooks/playSoundEffect";

import coin from "../../../../public/assets/misc/coin.png";
// Import sound effects
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";
import CloseGameModal from "../../modal/close/close";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const getRandomMissingIndexes = (word) => {
  const indexes = Array.from({ length: word.length }, (_, i) => i);
  const missingCount = Math.floor(word.length / 2);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, missingCount);
};

const Alphabet = () => {
  const navigate = useNavigate();

  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");
  const [missingIndexes, setMissingIndexes] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [userLevel, setUserLevel] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isCheckDisabled, setIsCheckDisabled] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const difficulty = params.get("difficulty");
  const [activeCharId, setActiveCharId] = useState(null);
  const [activeCharImg, setActiveCharImg] = useState(null);

  const praiseMessages = [
    "Great job!",
    "Awesome!",
    "You got it!",
    "Well done!",
    "Fantastic!",
    "Keep it up!",
    "Super!",
    "Nice work!",
  ];
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState("");
  const encouragementMessages = [
    "You can do it!",
    "Take your time!",
    "Give it a try!",
    "Trust your instincts!",
    "Keep going!",
    "Don't give up!",
    "You're doing great!",
    "Stay focused!",
  ];
  const [idleEncouragement, setIdleEncouragement] = useState("");
  const [idleTimer, setIdleTimer] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const playSoundEffect = usePlaySoundEffect();

  const activeCharacter = async () => {
    try {
      const token = Cookies.get("token");

      const activeCharacterRes = await axios.get(
        `${BASE_URL}/api/v1/characters/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        activeCharacterRes.data.character &&
        activeCharacterRes.data.character.charID
      ) {
        const id = activeCharacterRes.data.character.charID;
        setActiveCharId(id);
      } else {
        console.log("No active character found or unexpected response format");
        console.log(
          "Response data structure:",
          JSON.stringify(activeCharacterRes.data)
        );
      }
    } catch (error) {
      console.error("Error fetching active character:", error);
    }
  };
  useEffect(() => {
    activeCharacter();
  }, []);

  const getActiveCharacter = async () => {
    try {
      const charId = activeCharId;
      const activeChar = await axios.get(
        `${BASE_URL}/api/v1/characters/${charId}`
      );
      console.log("Active character data:", activeChar.data);
      setActiveCharImg(activeChar.data.character.charImg);
    } catch (error) {
      console.error("Error fetching active character:", error);
    }
  };
  useEffect(() => {
    if (activeCharId !== null) {
      getActiveCharacter();
    }
  }, [activeCharId]);

  useEffect(() => {
    // Clear any previous timer/interval
    if (idleTimer) clearInterval(idleTimer);

    // Only show encouragement if not disabled, not loading, not showing praise, and not saving
    if (!loading && !showPraise && !isSaving && !isSavingProfile) {
      // Show a message immediately if none is showing
      if (!idleEncouragement) {
        const randomEnc =
          encouragementMessages[
            Math.floor(Math.random() * encouragementMessages.length)
          ];
        setIdleEncouragement(randomEnc);
      }
      // Change encouragement every 5 seconds
      const interval = setInterval(() => {
        const randomEnc =
          encouragementMessages[
            Math.floor(Math.random() * encouragementMessages.length)
          ];
        setIdleEncouragement(randomEnc);
      }, 5000);

      setIdleTimer(interval);
    }

    // Cleanup
    return () => {
      if (idleTimer) clearInterval(idleTimer);
    };
    // eslint-disable-next-line
  }, [loading, showPraise, isSaving, isSavingProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/v1/games/${category}/${difficulty}`
      );
      const data = response.data.questions;
      console.log("Fetched data:", data);

      // Format the data to match our game structure
      const formattedQuestions = data.map((question) => ({
        word: question.correctAnswer.toUpperCase(),
        hint: question.questionDesc,
        imageURL: question.imageURL,
      }));

      setQuestions(formattedQuestions);

      // Set initial word and hint
      if (formattedQuestions.length > 0) {
        setCurrentWord(formattedQuestions[0].word);
        setHint(formattedQuestions[0].hint);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.profile) {
        setUserLevel(response.data.profile.userLevel || 1);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const saveGameResults = async (
    gameScore,
    gameCoins,
    isCompleted = false,
    updateUserLevel
  ) => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return false;
      }

      // Prepare data according to your API structure
      const gameData = {
        gameID: 2,
        earnedCoin: gameCoins,
        score: gameScore,
        lvlReached: updateUserLevel,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/history/alphabet`,
        gameData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        console.log("Game results saved successfully:", response.data.message);
        return true;
      } else {
        console.error("Failed to save game results:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving game results:", error);
      toast.error("Failed to save game results. Please try again.");
    }
  };

  const saveGameProfile = async (userLevel, coins, score) => {
    try {
      setIsSavingProfile(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const gameProfileData = {
        userLevel: userLevel,
        coins: coins,
        score: score,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/history/user-update`,
        gameProfileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        console.log("Game results saved successfully:", response.data.message);
        return true;
      } else {
        console.error("Failed to save game results:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving game profile:", error);
      // Log more details about the error
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    }
  };

  // This effect updates the game when currentIndex changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      setCurrentWord(questions[currentIndex].word);
      setHint(questions[currentIndex].hint);
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    if (currentWord) {
      // First, create the boxes with solid outlines (non-missing letters)
      const newMissingIndexes = getRandomMissingIndexes(currentWord);
      setMissingIndexes(newMissingIndexes);

      // Initialize user input with letters, empty strings only for missing indexes
      const newUserInput = currentWord.split("").map((letter, index) => {
        return newMissingIndexes.includes(index) ? "" : letter;
      });
      setUserInput(newUserInput);
    }
  }, [currentWord]);

  // Desktop drag and drop handlers
  const handleDrop = (event, index) => {
    event.preventDefault();
    // Only allow dropping in boxes with dashed outlines (missing indexes)
    if (missingIndexes.includes(index)) {
      const letter = event.dataTransfer.getData("text").toUpperCase();
      let newInput = [...userInput];
      newInput[index] = letter;
      setUserInput(newInput);
    }
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    // Only show drop effect for boxes with dashed outlines
    if (missingIndexes.includes(index)) {
      event.dataTransfer.dropEffect = "move";
    } else {
      event.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragStart = (event, letter) => {
    event.dataTransfer.setData("text", letter);
    setDraggedLetter(letter);
    setIsDragging(true);

    // Hide the default drag image
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    // Update drag position for desktop
    const updateDragPosition = (e) => {
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    // Initial position
    setDragPosition({ x: event.clientX, y: event.clientY });

    document.addEventListener("dragover", updateDragPosition);

    // Cleanup on drag end
    const cleanup = () => {
      document.removeEventListener("dragover", updateDragPosition);
      document.removeEventListener("dragend", cleanup);
    };

    document.addEventListener("dragend", cleanup);
  };

  const handleDragEnd = () => {
    setDraggedLetter(null);
    setIsDragging(false);
  };

  // Mobile touch handlers
  const handleTouchStart = (event, letter) => {
    event.preventDefault();
    setDraggedLetter(letter);
    setIsDragging(true);

    const touch = event.touches[0];
    setDragPosition({ x: touch.clientX, y: touch.clientY });

    // Add visual feedback for touch
    event.currentTarget.style.transform = "scale(1.1)";
    event.currentTarget.style.zIndex = "1000";
  };

  const handleTouchMove = (event) => {
    if (!isDragging || !draggedLetter) return;

    event.preventDefault();
    const touch = event.touches[0];

    // Update drag position
    setDragPosition({ x: touch.clientX, y: touch.clientY });

    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    // Find the letter box element
    const letterBox = elementBelow?.closest(".letter-box");
    if (letterBox) {
      const index = parseInt(letterBox.dataset.index);
      if (!isNaN(index) && missingIndexes.includes(index)) {
        // Add visual feedback
        letterBox.style.backgroundColor = "#e3f2fd";
        letterBox.style.border = "2px solid #2196f3";
      }
    }

    // Remove highlight from other boxes
    document.querySelectorAll(".letter-box").forEach((box) => {
      if (box !== letterBox) {
        box.style.backgroundColor = "";
        box.style.border = "";
      }
    });
  };

  const handleTouchEnd = (event) => {
    if (!isDragging || !draggedLetter) return;

    event.preventDefault();
    const touch = event.changedTouches[0];
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );

    // Find the letter box element
    const letterBox = elementBelow?.closest(".letter-box");
    if (letterBox) {
      const index = parseInt(letterBox.dataset.index);
      if (!isNaN(index) && missingIndexes.includes(index)) {
        let newInput = [...userInput];
        newInput[index] = draggedLetter;
        setUserInput(newInput);
      }
    }

    // Clean up
    setDraggedLetter(null);
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });

    // Remove visual feedback
    document.querySelectorAll(".letter-box").forEach((box) => {
      box.style.backgroundColor = "";
      box.style.border = "";
    });

    // Reset keyboard key style
    document.querySelectorAll(".keyboard-key").forEach((key) => {
      key.style.transform = "";
      key.style.zIndex = "";
    });
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCoins(0);
    setShowGameOver(false);
    setMessage("");
    setShowConfetti(false);
    // Reset to first question
    if (questions.length > 0) {
      setCurrentWord(questions[0].word);
      setHint(questions[0].hint);
    }
    window.location.reload();
  };

  const handleGameOverClose = () => {
    // This will navigate to homepage (handled in GameOver component)
    setShowGameOver(false);
  };

  const handleCloseModal = () => {
    setShowCongratulation(false);
  };

  const handleRetry = () => {
    resetGame();
  };
  const handlePlayAgain = () => {
    resetGame();
    setShowCongratulation(false);
  };

  const checkAnswer = async () => {
    setIsCheckDisabled(true);
    // Check if all missing letters are filled
    const hasEmptyFields = missingIndexes.some(
      (index) => !userInput[index] || userInput[index].trim() === ""
    );

    if (hasEmptyFields) {
      toast.warn("Please fill in all the missing letters!");
      return;
    }

    const userAnswer = userInput.join("");
    const correctAnswer = currentWord;

    console.log("User answer:", userAnswer);
    console.log("Correct answer:", correctAnswer);
    console.log("Answers match:", userAnswer === correctAnswer);

    if (userAnswer === correctAnswer) {
      // Correct answer
      playSoundEffect(correctSound);
      toast.success("Fantastic! You did it! 🌟");

      // Show praise bubble
      const randomPraise =
        praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
      setPraiseText(randomPraise);
      setShowPraise(true);
      setTimeout(() => setShowPraise(false), 3000);

      setShowConfetti(true);

      const newScore = score + 10;
      const newCoins = coins + 2;

      setScore(newScore);
      setCoins(newCoins);

      setTimeout(() => {
        setShowConfetti(false);
        if (currentIndex < questions.length - 1) {
          // Move to the next question
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setIsCheckDisabled(false);
        } else {
          toast.info("You completed all words! 🏆");

          try {
            const MAX_LEVEL = 100;
            let levelToAdd = 2;
            if (userLevel + levelToAdd > MAX_LEVEL) {
              levelToAdd = MAX_LEVEL - userLevel;
              if (levelToAdd < 0) levelToAdd = 0;
            }
            const newLevel =
              userLevel + levelToAdd > MAX_LEVEL
                ? MAX_LEVEL
                : userLevel + levelToAdd;

            const saveSuccess = saveGameResults(
              newScore,
              newCoins,
              true,
              newLevel
            );
            const saveProfileSuccess = saveGameProfile(
              newLevel,
              newCoins,
              newScore
            );

            if (saveSuccess && saveProfileSuccess) {
              setShowCongratulation(true);
            } else {
              setShowCongratulation(true);
            }
          } catch (error) {
            console.error("Error saving game completion:", error);
            setShowCongratulation(true);
          }
        }
      }, 2000);
    } else {
      playSoundEffect(incorrectSound);

      // Show toast notification for wrong answer
      toast.error("Wrong answer! Try again!");

      // Add shake animation
      const container = document.querySelector(".game-container");
      if (container) {
        container.classList.add("shake");
        setTimeout(() => {
          container.classList.remove("shake");
        }, 1000);
      }

      try {
        // Save game results (game over - not completed)
        const saveSuccess = await saveGameResults(
          score,
          coins,
          true,
          userLevel
        );
        const saveProfileSuccess = await saveGameProfile(
          userLevel,
          coins,
          score
        );
        if (saveSuccess && saveProfileSuccess) {
          setShowGameOver(true);
        } else {
          // Handle save failure
          console.error("Failed to save game results");
          setShowGameOver(true); // Still show modal even if save fails
        }
      } catch (error) {
        console.error("Error saving game over:", error);
        setShowGameOver(true);
      }
      setTimeout(() => {
        playSoundEffect(gameOverSound);
      }, 300);
    }
  };

  // Debug log to check showGameOver state
  useEffect(() => {
    console.log("showGameOver state changed:", showGameOver);
  }, [showGameOver]);

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="error">
        No questions available. Please try again later.
      </div>
    );
  }

  return (
    <>
      <motion.div
        className={`game-wrapper ${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showConfetti && <Confetti width={width} height={height} />}

        <div className="game-container">
          <motion.div
            className="game-header m-0"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <h1 className="game-title">Alphabet Adventure 🎯</h1>
            <div className="score-display text-center">
              Question {Math.min(currentIndex + 1, 10)} of {questions.length}
            </div>
          </motion.div>

          <motion.div
            className="coin-display"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={coin} alt="Coin" className="coin-icon" />
            <span className="coin-count">{coins}</span>
          </motion.div>

          <div className="d-flex justify-content-center align-items-center">
            {questions[currentIndex] && questions[currentIndex].imageURL && (
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={questions[currentIndex].imageURL}
                alt={questions[currentIndex].word}
                className="question-image p-0"
              />
            )}

            <motion.div
              className="hint-container m-3 w-100"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="hint-text">{hint}</h2>
            </motion.div>
          </div>

          <motion.div
            className="word-container mx-0 my-3"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {userInput.map((char, index) => (
              <motion.div
                key={index}
                className={`letter-box ${
                  missingIndexes.includes(index) ? "empty" : "filled"
                }`}
                data-index={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  cursor: missingIndexes.includes(index)
                    ? "pointer"
                    : "default",
                }}
              >
                {char}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="keyboard-container m-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="keyboard-row d-flex justify-content-center flex-wrap"
              >
                {row.map((letter) => (
                  <motion.div
                    key={letter}
                    className="keyboard-key"
                    draggable
                    onDragStart={(e) => handleDragStart(e, letter)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, letter)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      touchAction: "none", // Prevent default touch behaviors
                      userSelect: "none", // Prevent text selection
                    }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>

          <div className="d-flex justify-content-center">
            <motion.button
              className="check-button"
              onClick={checkAnswer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isCheckDisabled}
            >
              Submit
            </motion.button>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                className="message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="character" style={{ position: "relative" }}>
          {showPraise && (
            <div
              className="praise-bubble"
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translate(-50%, -20px)",
                background: "#fffbe7",
                color: "#c77d00",
                borderRadius: "18px",
                padding: "8px 18px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                border: "2px solid #ffd54f",
                zIndex: 10,
                whiteSpace: "nowrap",
                animation: "praise-pop .5s",
              }}
            >
              {praiseText}
            </div>
          )}
          {idleEncouragement && !showPraise && (
            <div
              className="praise-bubble"
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translate(-50%, -20px)",
                background: "#e3f2fd",
                color: "#1976d2",
                borderRadius: "18px",
                padding: "8px 18px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                border: "2px solid #90caf9",
                zIndex: 10,
                whiteSpace: "nowrap",
                animation: "praise-pop .5s",
              }}
            >
              {idleEncouragement}
            </div>
          )}
          <img src={activeCharImg} alt="character" className="character-img" />
        </div>

        {/* Dragged Letter Visual */}
        {isDragging && draggedLetter && (
          <div
            style={{
              position: "fixed",
              left: dragPosition.x - 20,
              top: dragPosition.y - 20,
              width: "40px",
              height: "40px",
              backgroundColor: theme === "dark" ? "#9f265c" : "#c34286",
              color: theme === "dark" ? "#ffffff" : "#333333",
              border: `2px solid ${theme === "dark" ? "#9f265c" : "#9f265c"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              pointerEvents: "none",
              zIndex: 9999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              transform: "scale(1.1)",
              transition: "none",
            }}
          >
            {draggedLetter}
          </div>
        )}

        {/* Game Over Modal - Debug info */}
        {console.log("Rendering GameOver modal:", showGameOver)}
        <AnimatePresence>
          {showGameOver && (
            <GameOver
              onClose={handleGameOverClose}
              onRetry={handleRetry}
              score={score / 10}
              coins={coins}
            />
          )}
          {showCongratulation && (
            <Congratulation
              onClose={handleCloseModal}
              onPlayAgain={handlePlayAgain}
              score={score}
              coins={coins}
            />
          )}
        </AnimatePresence>

        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
        />
      </motion.div>
      <div
        className="close-btn"
        onClick={() => setShowCloseModal(true)}
        title="Close"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 2000,
          background: "#fff",
          borderRadius: "50%",
          width: 40,
          height: 44.8,
          boxShadow:
            "0 4px 16px rgba(255,193,7,0.18), 0 1.5px 4px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "3px solid #ffb300",
          fontSize: "2rem",
          color: "#ffb300",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
          outline: "none",
          userSelect: "none",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#fff8e1";
          e.currentTarget.style.boxShadow =
            "0 6px 24px rgba(255,193,7,0.28), 0 2px 8px rgba(0,0,0,0.13)";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.boxShadow =
            "0 4px 16px rgba(255,193,7,0.18), 0 1.5px 4px rgba(0,0,0,0.10)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        tabIndex={0}
      >
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            lineHeight: 1,
            color: "#ffb300",
            pointerEvents: "none",
            fontFamily: "Arial, sans-serif",
            marginTop: "-2px",
          }}
        >
          ×
        </span>
      </div>
      <CloseGameModal
        show={showCloseModal}
        onConfirm={() => (window.location.href = "/homepage")}
        onCancel={() => setShowCloseModal(false)}
      />
    </>
  );
};

export default Alphabet;
