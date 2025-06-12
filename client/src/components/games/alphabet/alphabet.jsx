import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import GameOver from "../../modal/game-over/gameover"; // Import the GameOver component

import coin from "../../../../public/assets/misc/coin.png";
// Import sound effects
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";

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
  const inputRefs = useRef([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/games/things"
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
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCoins(0);
    setShowGameOver(false);
    setMessage("");
    // Reset to first question
    if (questions.length > 0) {
      setCurrentWord(questions[0].word);
      setHint(questions[0].hint);
    }
  };

  const handleGameOverClose = () => {
    // This will navigate to homepage (handled in GameOver component)
    setShowGameOver(false);
  };

  const handleRetry = () => {
    resetGame();
  };

  const checkAnswer = () => {
    if (userInput.join("") === currentWord) {
      playSoundEffect(correctSound);
      toast.success("Fantastic! You did it! 🌟");
      setShowConfetti(true);
      setScore(score + 10);
      setCoins(coins + 2);

      setTimeout(() => {
        setShowConfetti(false);
        if (currentIndex < questions.length - 1) {
          // Move to the next question
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          playSoundEffect(gameOverSound);
          toast.info("You completed all words! 🏆");
        }
      }, 2000);
    } else {
      // Wrong answer - show game over modal
      playSoundEffect(incorrectSound);
      playSoundEffect(gameOverSound);
      setShowGameOver(true);

      const container = document.querySelector(".game-container");
      container.classList.add("shake");
      setTimeout(() => {
        container.classList.remove("shake");
      }, 1000);
    }
  };

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
    <motion.div
      className={`game-wrapper ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && <Confetti width={width} height={height} />}

      <div className="game-container p-4">
        <motion.div
          className="game-header m-0"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h1 className="game-title">Alphabet Adventure 🎯</h1>
          <div className="score-display text-center">
            Question {currentIndex + 1} of {questions.length}
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                cursor: missingIndexes.includes(index) ? "pointer" : "default",
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
            <div key={rowIndex} className="keyboard-row">
              {row.map((letter) => (
                <motion.div
                  key={letter}
                  className="keyboard-key"
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
        <div className="d-flex justify-content-center">
          <motion.button
            className="check-button m-1"
            onClick={checkAnswer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Answer
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

      {/* Game Over Modal */}
      <AnimatePresence>
        {showGameOver && (
          <GameOver
            onClose={handleGameOverClose}
            onRetry={handleRetry}
            score={score / 10}
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
  );
};

export default Alphabet;
