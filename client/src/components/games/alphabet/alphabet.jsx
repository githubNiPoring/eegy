import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./style.css";

const WORDS = [
  { word: "APPLE", hint: "A red fruit that keeps the doctor away! 🍎" },
  { word: "ZEBRA", hint: "Black and white stripes, loves to gallop! 🦓" },
  { word: "HOUSE", hint: "A cozy place where families live! 🏠" },
  { word: "TIGER", hint: "A big cat with orange and black stripes! 🐯" },
  { word: "BEACH", hint: "Sand, waves, and lots of fun! 🏖️" },
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORDS[currentIndex].word);
  const [hint, setHint] = useState(WORDS[currentIndex].hint);
  const [missingIndexes, setMissingIndexes] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    // First, create the boxes with solid outlines (non-missing letters)
    const newMissingIndexes = getRandomMissingIndexes(currentWord);
    setMissingIndexes(newMissingIndexes);

    // Initialize user input with letters, empty strings only for missing indexes
    const newUserInput = currentWord.split("").map((letter, index) => {
      return newMissingIndexes.includes(index) ? "" : letter;
    });
    setUserInput(newUserInput);
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

  const checkAnswer = () => {
    if (userInput.join("") === currentWord) {
      setMessage("Fantastic! You did it! 🌟");
      setShowConfetti(true);
      setScore(score + 10);

      setTimeout(() => {
        setShowConfetti(false);
        if (currentIndex < WORDS.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setCurrentWord(WORDS[currentIndex + 1].word);
          setHint(WORDS[currentIndex + 1].hint);
        } else {
          setMessage("You completed all words! 🏆");
        }
      }, 2000);
    } else {
      setMessage("Almost there! Try again! 💪");
      const container = document.querySelector(".game-container");
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
  };

  return (
    <motion.div
      className={`game-wrapper ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && <Confetti width={width} height={height} />}

      <div className="game-container">
        <motion.div
          className="game-header"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <h1 className="game-title">Alphabet Adventure 🎯</h1>
          <div className="score-display">Score: {score}</div>
        </motion.div>

        <motion.div
          className="hint-container"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="hint-text">{hint}</h2>
        </motion.div>

        <motion.div
          className="word-container"
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
          className="keyboard-container"
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

        <motion.button
          className="check-button"
          onClick={checkAnswer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Check Answer
        </motion.button>

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
    </motion.div>
  );
};

export default Alphabet;
