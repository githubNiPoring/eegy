import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import GameOver from "../../modal/game-over/gameover";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";

import coin from "../../../../public/assets/misc/coin.png";
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";

import "./style.css";

const Wordbuddy = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/games/questions"
      );
      const data = response.data.questions;
      console.log("Fetched data:", data);

      // Keep the original structure instead of reformatting
      setQuestions(data);

      // Set up initial question with options
      if (data.length > 0) {
        setCurrentWordIndex(0);
        setupCurrentQuestion(0);
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
  // Function to shuffle array (for randomizing options)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate wrong options for a word
  const generateWrongOptions = (correctWord, allWords) => {
    // Get all words except the correct one
    const otherWords = allQuestions.filter(
      (q) => q.correctAnswer !== correctWord
    );

    // Randomly select 3 words from other words
    const wrongOptions = [];
    const shuffledWords = shuffleArray(otherWords);

    // Take up to 3 words or as many as available
    for (let i = 0; i < Math.min(3, shuffledWords.length); i++) {
      wrongOptions.push(shuffledWords[i].correctAnswer);
    }

    // If we don't have enough words, generate some dummy options
    while (wrongOptions.length < 3) {
      // Create variations of the correct word
      const dummyWord = correctWord
        .split("")
        .map((char, idx) =>
          idx % 2 === 0 ? String.fromCharCode(char.charCodeAt(0) + 1) : char
        )
        .join("");

      if (!wrongOptions.includes(dummyWord) && dummyWord !== correctWord) {
        wrongOptions.push(dummyWord);
      } else {
        // Add a random word if we can't create a variation
        wrongOptions.push("WORD" + Math.floor(Math.random() * 1000));
      }
    }

    return wrongOptions;
  };

  // Set up current question with options
  const setupCurrentQuestion = (questionIndex) => {
    if (questions.length === 0 || questionIndex >= questions.length) return;

    const currentQuestion = questions[questionIndex];
    setCurrentWord(currentQuestion.correctAnswer);
    setHint(currentQuestion.questionDesc);

    // Generate 3 wrong options + 1 correct option
    const wrongOptions = generateWrongOptions(
      currentQuestion.correctAnswer
      // No need to pass questions here, as the function will access it directly
    );
    const allOptions = [...wrongOptions, currentQuestion.correctAnswer];

    // Shuffle options so correct answer isn't always in the same position
    setCurrentOptions(shuffleArray(allOptions));
  };

  const handleAnswer = (selectedWord) => {
    if (!currentWord) return;

    if (selectedWord === currentWord) {
      playSoundEffect(correctSound);
      setShowConfetti(true);
      setScore(score + 10);
      setCoins(coins + 5);
      setMessage("Correct! 🎉");

      setTimeout(() => {
        setShowConfetti(false);
        setMessage("");
        // Check if there are more questions
        if (currentWordIndex < questions.length - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          setupCurrentQuestion(nextIndex);
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
    setupCurrentQuestion(0);
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
          {questions.length > 0 && currentWordIndex < questions.length && (
            <>
              {questions[currentWordIndex].imageURL && (
                <motion.img
                  src={questions[currentWordIndex].imageURL}
                  alt="question"
                  className="word-image"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <motion.div
                className="hint-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {hint}
              </motion.div>
            </>
          )}
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
            {!loading &&
              currentOptions.map((option, index) => (
                <motion.button
                  key={index}
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

        {loading && (
          <div className="loading">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="loading-spinner"
            />
            <p>Loading questions...</p>
          </div>
        )}
      </motion.div>

      {showGameOver && (
        <GameOver onClose={handleCloseGameOver} score={score} coins={coins} />
      )}
    </div>
  );
};

export default Wordbuddy;
