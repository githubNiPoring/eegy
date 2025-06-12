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
  const [score, setScore] = useState(1);
  const [coins, setCoins] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");

  // Decorative emojis for the background
  const decorations = ["🍎", "🍌", "🍓", "🍊", "🥝", "🍉", "🍇"];
  const [randomEmojis, setRandomEmojis] = useState([]);

  useEffect(() => {
    // Set random emojis for decoration
    setRandomEmojis([
      decorations[Math.floor(Math.random() * decorations.length)],
      decorations[Math.floor(Math.random() * decorations.length)],
      decorations[Math.floor(Math.random() * decorations.length)],
    ]);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/games/fruit"
      );
      const data = response.data.questions;
      console.log("Fetched data:", data);

      // Keep the original structure instead of reformatting
      setQuestions(data);

      // Set up initial question with options
      if (data.length > 0) {
        setCurrentWordIndex(0);
        setupCurrentQuestion(0, data);
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
  const generateWrongOptions = (correctWord, allQuestions) => {
    // Filter out the current correct answer to avoid duplicates
    const otherQuestions = allQuestions.filter(
      (q) => q.correctAnswer !== correctWord
    );

    // Randomly select 3 words from other questions
    const wrongOptions = [];
    const shuffledQuestions = shuffleArray(otherQuestions);

    // Take up to 3 words or as many as available
    for (let i = 0; i < Math.min(3, shuffledQuestions.length); i++) {
      // Only add if it's not already in our wrong options
      if (
        shuffledQuestions[i].correctAnswer &&
        !wrongOptions.includes(shuffledQuestions[i].correctAnswer)
      ) {
        wrongOptions.push(shuffledQuestions[i].correctAnswer);
      }
    }

    // If we don't have enough words, generate some kid-friendly fruit names
    while (wrongOptions.length < 3) {
      const fruitOptions = [
        "Apple",
        "Banana",
        "Orange",
        "Grape",
        "Pear",
        "Pineapple",
        "Watermelon",
        "Kiwi",
        "Blueberry",
        "Peach",
        "Cherry",
        "Lemon",
        "Raspberry",
      ];
      const randomOption =
        fruitOptions[Math.floor(Math.random() * fruitOptions.length)];

      if (
        !wrongOptions.includes(randomOption) &&
        randomOption !== correctWord
      ) {
        wrongOptions.push(randomOption);
      } else {
        // Try another random fruit if this one is already used
        continue;
      }
    }

    return wrongOptions;
  };

  // Set up current question with options
  const setupCurrentQuestion = (questionIndex, questionsData = questions) => {
    if (questionsData.length === 0 || questionIndex >= questionsData.length)
      return;

    const currentQuestion = questionsData[questionIndex];

    // Check if currentQuestion has a correctAnswer property
    const correctAnswer = currentQuestion.correctAnswer || "Strawberry"; // Default to "Strawberry" if missing

    setCurrentWord(correctAnswer);
    setHint(currentQuestion.questionDesc || "What fruit is this?"); // Default hint if missing

    // Generate 3 wrong options + 1 correct option
    const wrongOptions = generateWrongOptions(correctAnswer, questionsData);
    const allOptions = [...wrongOptions, correctAnswer];

    // Shuffle options so correct answer isn't always in the same position
    setCurrentOptions(shuffleArray(allOptions));
  };

  const handleAnswer = (selectedWord) => {
    if (!currentWord) return;

    if (selectedWord === currentWord) {
      playSoundEffect(correctSound);
      setShowConfetti(true);
      setScore(score + 1);
      setCoins(coins + 1);
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
      <motion.div
        className="decoration decoration-1"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      >
        {randomEmojis[0]}
      </motion.div>
      <motion.div
        className="decoration decoration-2"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      >
        {randomEmojis[1]}
      </motion.div>
      <motion.div
        className="decoration decoration-3"
        animate={{
          y: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      >
        {randomEmojis[2]}
      </motion.div>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

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
            <p className="h3 text-warning d-flex align-items-center justify-content-center mb-0">
              <img src={coin} alt="coin" width="30" className="me-2" />
              {coins}
            </p>
            <div className="score-display text-center bg-warning p-2 rounded-pill">
              Question {score} of {questions.length}
            </div>
            {/* <div className="coin-display">
              <motion.img
                src={coin}
                alt="coin"
                className="coin-icon"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span>{coins}</span>
            </div>
            <div className="score-display">Score: {score}</div> */}
          </div>
        </div>

        <div className="game-content">
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option}
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
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
