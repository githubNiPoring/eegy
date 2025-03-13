import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import GameOver from "../../modal/game-over/gameover";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import apple from "../../../assets/game-icons/apple.png";
import coin from "../../../assets/coin.png";
import correctSound from "../../../assets/audio/correct.mp3";
import incorrectSound from "../../../assets/audio/incorrect.mp3";
import gameOverSound from "../../../assets/audio/game-over.mp3";

import "./style.css";

const WORDS = [
  {
    word: "Apple",
    image: apple,
    options: ["Apple", "Banana", "Orange", "Grape"],
  },
  // Add more words here
];

const Wordbuddy = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");

  const currentWord = WORDS[currentWordIndex];

  const handleAnswer = (selectedWord) => {
    if (selectedWord === currentWord.word) {
      playSoundEffect(correctSound);
      setShowConfetti(true);
      setScore(score + 10);
      setCoins(coins + 5);
      setMessage("Correct! 🎉");

      setTimeout(() => {
        setShowConfetti(false);
        setMessage("");
        if (currentWordIndex < WORDS.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          playSoundEffect(gameOverSound);
          setShowGameOver(true);
        }
      }, 2000);
    } else {
      playSoundEffect(incorrectSound);
      setMessage("Try again! ❌");
      setCoins(Math.max(0, coins - 2));

      // Shake animation will be handled by CSS
      const container = document.querySelector(".game-container");
      container.classList.add("shake");
      setTimeout(() => {
        container.classList.remove("shake");
        setMessage("");
      }, 500);
    }
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
    setCurrentWordIndex(0);
    setScore(0);
    setCoins(100);
  };

  return (
    <div className={`game-wrapper ${theme}`}>
      {showConfetti && <Confetti width={width} height={height} />}

      <motion.div
        className="game-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-header">
          <motion.h1
            className="game-title"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            Word Buddy
          </motion.h1>

          <div className="stats-container">
            <div className="coin-display">
              <motion.img
                src={coin}
                alt="coin"
                className="coin-icon"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span>{coins}</span>
            </div>
            <div className="score-display">Score: {score}</div>
          </div>
        </div>

        <motion.div
          className="word-card"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={currentWord.image}
            alt={currentWord.word}
            className="word-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />

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
        </motion.div>

        <div className="options-container">
          <AnimatePresence>
            {currentWord.options.map((option, index) => (
              <motion.button
                key={option}
                className="option-button"
                onClick={() => handleAnswer(option)}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {showGameOver && (
        <GameOver onClose={handleCloseGameOver} score={score} coins={coins} />
      )}
    </div>
  );
};

export default Wordbuddy;
