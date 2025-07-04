import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import GameOver from "../../modal/game-over/gameover";
import Congratulation from "../../modal/congratulations/congratulations";
import axios from "axios";
import Cookies from "js-cookie";
import "./style.css";
import { usePlaySoundEffect } from "../../../hooks/playSoundEffect";
import { useLocation } from "react-router-dom";

// Import sound effects
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";
import keyPressSound from "../../../../public/assets/audio/key-press.mp3";
import CloseGameModal from "../../modal/close/close";

import coin from "../../../../public/assets/misc/coin.png";

const MAX_GUESSES = 5;
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "Backspace", "Enter"],
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

const KidWordle = () => {
  const { theme } = useTheme();

  // Define all state hooks at the top of the component
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);
  const [usedLetters, setUsedLetters] = useState({});
  const [invalidWord, setInvalidWord] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [missingIndexes, setMissingIndexes] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [userLevel, setUserLevel] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "animals"; // default to animals
  const containerRef = useRef(null);
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

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/games/${category}`);
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

        // Initialize userInput array based on word length
        setUserInput(Array(formattedQuestions[0].word.length).fill(""));

        // Set initial missing indexes
        const initialMissingIndexes = [];
        for (let i = 0; i < formattedQuestions[0].word.length; i++) {
          initialMissingIndexes.push(i);
        }
        setMissingIndexes(initialMissingIndexes);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // This effect runs only once on component mount
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
        setUserLevel(response.data.profile.userLevel);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const saveGameResults = async (gameScore, gameCoins, updateUserLevel) => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return false;
      }

      // Prepare data according to your API structure
      const gameData = {
        gameID: 3,
        earnedCoin: gameCoins,
        score: gameScore,
        lvlReached: updateUserLevel,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/history/wordle`,
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
    }
  };

  const saveGameProfile = async (userLevel, coins, score) => {
    try {
      setIsSavingProfile(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return false;
      }

      const gameProfileData = {
        userLevel: userLevel,
        coins: coins,
        score: score,
      };

      console.log("Saving profile with:", gameProfileData); // Add logging

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

      console.log("Profile update response:", response.data); // Add logging
      if (response.data && response.data.success) {
        console.log("Game results saved successfully:", response.data.message);
        return true;
      } else {
        console.error("Failed to save game results:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving game profile:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const newWord = questions[currentIndex].word;
      setCurrentWord(newWord);
      setHint(questions[currentIndex].hint);

      // Reset for new word
      setUserInput(Array(newWord.length).fill(""));
      setGuesses([]);
      setCurrentGuess("");
      setGameOver(false); // Make sure gameOver is reset to false
      setUsedLetters({});
      setInvalidWord(false);
      setMessage(""); // Clear any messages

      // Reset missing indexes
      const newMissingIndexes = [];
      for (let i = 0; i < newWord.length; i++) {
        newMissingIndexes.push(i);
      }
      setMissingIndexes(newMissingIndexes);
    }
  }, [currentIndex, questions]);

  const resetGame = () => {
    setCurrentIndex(1);
    setScore(0);
    setCoins(0);
    setShowGameOver(false);
    setMessage("");
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

  const handleRetry = () => {
    resetGame();
  };
  const handlePlayAgain = () => {
    resetGame();
    setShowCongratulation(false);
  };

  const handleSubmit = async () => {
    if (currentGuess.length !== currentWord.length || gameOver) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    const newUsedLetters = { ...usedLetters };
    const statusArray = getLetterStatus(currentWord, currentGuess);

    // Update letter statuses - a letter can be promoted but not demoted
    currentGuess.split("").forEach((letter, index) => {
      const newStatus = statusArray[index];
      const currentStatus = newUsedLetters[letter];

      // Define a hierarchy of statuses (correct > wrong position > wrong)
      const statusRank = {
        "bg-success text-white": 3, // Correct position (highest)
        "bg-warning text-white": 2, // Wrong position (middle)
        "bg-secondary text-white": 1, // Wrong (lowest)
        undefined: 0, // Not used yet
      };

      // Only update if the new status is higher ranked than the current one
      if (!currentStatus || statusRank[newStatus] > statusRank[currentStatus]) {
        newUsedLetters[letter] = newStatus;
      }
    });

    setUsedLetters(newUsedLetters);

    if (currentGuess === currentWord) {
      playSoundEffect(correctSound);

      // Add 1 to score and 3 to coins when user answers correctly
      setScore((prevScore) => prevScore + 1);
      setCoins((prevCoins) => prevCoins + 3);

      // Instead of immediately ending the game, check if there are more questions
      if (currentIndex < questions.length - 1) {
        setMessage("Great job! Moving to next word...");

        // Show praise bubble
        const randomPraise =
          praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
        setPraiseText(randomPraise);
        setShowPraise(true);
        setTimeout(() => setShowPraise(false), 3000);
        setIdleEncouragement("");

        // Add a short delay before moving to the next question
        setTimeout(() => {
          setMessage("");
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setGuesses([]);
          setCurrentGuess("");
          setUsedLetters({});
        }, 1500);
      } else {
        try {
          const MAX_LEVEL = 100;
          const levelToAdd = Math.min(3, MAX_LEVEL - userLevel);
          const newUserLevel = userLevel + levelToAdd;
          const finalScore = score + 1;
          const finalCoins = coins + 3;

          const saveSuccess = await saveGameResults(
            finalScore * 10,
            finalCoins,
            newUserLevel
          );
          const saveProfileSuccess = await saveGameProfile(
            newUserLevel,
            coins,
            score
          );

          if (saveSuccess && saveProfileSuccess) {
            setShowCongratulation(true);
            setMessage("You completed all words! 🏆");
          } else {
            // Handle save failure
            console.error("Failed to save game results");
            setShowCongratulation(true); // Still show modal even if save fails
          }
        } catch (error) {
          console.error("Error saving game results:", error);
        }
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      playSoundEffect(gameOverSound);
      setGameOver(true);

      const saveSuccess = await saveGameResults(score * 10, coins, userLevel);
      const saveProfileSuccess = await saveGameProfile(userLevel, coins, score);

      if (saveSuccess && saveProfileSuccess) {
        setShowGameOver(true);
        setMessage("You completed all words! 🏆");
      } else {
        // Handle save failure
        console.error("Failed to save game results");
        setShowGameOver(true); // Still show modal even if save fails
      }
    } else {
      // Play different sounds based on how many correct letters there are
      const correctCount = statusArray.filter(
        (status) => status === "bg-success text-white"
      ).length;
      if (correctCount > 0) {
        playSoundEffect(incorrectSound);
      } else {
        playSoundEffect(incorrectSound);
      }
      setCoins((prevCoins) => Math.max(prevCoins - 1, 0));
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't process key events if game is over
      if (gameOver) return;

      const key = e.key;

      // Handle letter keys (only allow A-Z, a-z)
      if (/^[A-Za-z]$/.test(key) && currentGuess.length < currentWord.length) {
        playSoundEffect(keyPressSound);
        setCurrentGuess((prev) => prev + key.toUpperCase());
        setInvalidWord(false);
      }
      // Handle backspace
      else if (key === "Backspace") {
        playSoundEffect(keyPressSound);
        setCurrentGuess((prev) => prev.slice(0, -1));
        setInvalidWord(false);
      }
      // Handle Enter - fix: only process Enter when guess is complete
      else if (key === "Enter" && currentGuess.length === currentWord.length) {
        handleSubmit();
      }
    };

    // Add the event listener immediately when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentGuess, gameOver, currentWord.length, handleSubmit]);

  const checkAnswer = () => {
    if (userInput.join("") === currentWord) {
      playSoundEffect(correctSound);
      setMessage("Fantastic! You did it! 🌟");
      setShowConfetti(true);

      // Add 1 to score and 3 to coins when user answers correctly
      setScore((prevScore) => prevScore + 1);
      setCoins((prevCoins) => prevCoins + 3);

      setTimeout(() => {
        setShowConfetti(false);
        if (currentIndex < questions.length - 1) {
          // Move to the next question
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          playSoundEffect(gameOverSound);
          setMessage("You completed all words! 🏆");
        }
      }, 2000);
    } else {
      playSoundEffect(incorrectSound);
      setMessage("Almost there! Try again! 💪");
      const container = document.querySelector(".game-container");
      if (container) {
        container.classList.add("shake");
        setTimeout(() => {
          container.classList.remove("shake");
          // Reset only the missing letters, keep the solid outline letters
          const resetInput = currentWord.split("").map((letter, index) => {
            return missingIndexes.includes(index) ? "" : letter;
          });
          setUserInput(resetInput);
          setMessage("");
        }, 1000);
      }
    }
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
  };
  const handleCloseModal = () => {
    setShowCongratulation(false);
  };

  const handleInput = (key) => {
    if (gameOver) return;

    if (/^[A-Za-z]$/.test(key) && currentGuess.length < currentWord.length) {
      playSoundEffect(keyPressSound);
      setCurrentGuess((prev) => prev + key.toUpperCase());
      setInvalidWord(false);
    } else if (key === "Backspace") {
      playSoundEffect(keyPressSound);
      setCurrentGuess((prev) => prev.slice(0, -1));
      setInvalidWord(false);
    } else if (key === "Enter" && currentGuess.length === currentWord.length) {
      handleSubmit();
    }
  };

  const getLetterStatus = (word, guess) => {
    let statusArray = new Array(word.length).fill("bg-secondary text-white");
    let letterCount = {};

    for (let letter of word) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let i = 0; i < word.length; i++) {
      if (guess[i] === word[i]) {
        statusArray[i] = "bg-success text-white";
        letterCount[guess[i]]--;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (
        guess[i] !== word[i] &&
        word.includes(guess[i]) &&
        letterCount[guess[i]] > 0
      ) {
        statusArray[i] = "bg-warning text-white";
        letterCount[guess[i]]--;
      }
    }

    return statusArray;
  };

  const getLetterClassName = (letter, index, guess) => {
    if (!guess) return "empty";
    const status = getLetterStatus(currentWord, guess)[index];
    if (status === "bg-success text-white") return "correct";
    if (status === "bg-warning text-white") return "wrong-pos";
    return "wrong";
  };

  const getKeyboardKeyClassName = (key) => {
    if (!usedLetters[key]) return "";
    if (usedLetters[key] === "bg-success text-white") return "correct";
    if (usedLetters[key] === "bg-warning text-white") return "wrong-pos";
    return "wrong";
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`kidwordle-wrapper ${theme}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="container hint-card"
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
        >
          <div className="clue outline card d-flex flex-column justify-content-center align-items-center">
            {questions[currentIndex] && questions[currentIndex].imageURL && (
              <img
                className="card-img-size"
                src={questions[currentIndex].imageURL}
                alt="Word hint"
              />
            )}
            <hr className="divider-line" />
            <div className="card-body">
              {hint && <p className="hint-text">{hint}</p>}
              {message && <p className="message-text">{message}</p>}
            </div>
          </div>
        </motion.div>
        <div className="game-container">
          <motion.h1 className="game-title">
            {"KidWordle".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
              >
                {letter}
              </motion.span>
            ))}
            <span>🎯</span>
          </motion.h1>
          <div className="d-flex justify-content-between align-items-center mb-0">
            <p className="h3 text-warning d-flex align-items-center justify-content-center mb-0">
              <img src={coin} alt="coin" width="30" className="me-2" />
              {coins}
            </p>
            <div className="score-display text-center bg-warning p-2 rounded-pill">
              Question {Math.min(currentIndex + 1, 10)} of {questions.length}
            </div>
          </div>
          <hr />
          <motion.div className="word-grid">
            {[...Array(MAX_GUESSES)].map((_, i) => (
              <motion.div
                key={i}
                className="word-row"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {(
                  guesses[i] ||
                  (i === guesses.length
                    ? currentGuess.padEnd(currentWord.length, " ")
                    : " ".repeat(currentWord.length))
                )
                  .split("")
                  .map((letter, j) => (
                    <motion.div
                      key={j}
                      className={`letter-box ${getLetterClassName(
                        letter,
                        j,
                        guesses[i]
                      )}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: j * 0.1 }}
                    >
                      {letter !== " " ? letter : ""}
                    </motion.div>
                  ))}
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {invalidWord && (
              <motion.p
                className="invalid-word"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                Oops! That's not a word! Try again! 🤔
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div className="keyboard">
            {KEYBOARD_ROWS.map((row, i) => (
              <div key={i} className="keyboard-row">
                {row.map((key) => (
                  <motion.button
                    key={key}
                    className={`keyboard-key ${
                      key.length > 1 ? "special" : ""
                    } ${getKeyboardKeyClassName(key)}`}
                    onClick={() => handleInput(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {key === "Backspace" ? "⌫" : key === "Enter" ? "✓" : key}
                  </motion.button>
                ))}
              </div>
            ))}
          </motion.div>
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

        <AnimatePresence>
          {showGameOver && (
            <GameOver
              onClose={handleGameOverClose}
              onRetry={handleRetry}
              score={score}
              coins={coins}
            />
          )}
          {showCongratulation && (
            <Congratulation
              onClose={handleCloseModal}
              onPlayAgain={handlePlayAgain}
              score={score * 10}
              coins={coins}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <div
        className="close-btn"
        onClick={() => setShowCloseModal(true)}
        title="Close"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 2000,
          background: "#fff",
          borderRadius: "50%",
          width: 56,
          height: 56,
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
            fontSize: "2rem",
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

export default KidWordle;
