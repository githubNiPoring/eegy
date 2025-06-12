import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import GameOver from "../../modal/game-over/gameover";
import axios from "axios";
import "./style.css";

// Import sound effects
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";
import keyPressSound from "../../../../public/assets/audio/key-press.mp3";

import coin from "../../../../public/assets/misc/coin.png";

const MAX_GUESSES = 5;
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "Backspace", "Enter"],
];

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
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(1);
  const [coins, setCoins] = useState(0);
  const [missingIndexes, setMissingIndexes] = useState([]);
  const [userInput, setUserInput] = useState([]);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/games/animals"
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

        // Add a short delay before moving to the next question
        setTimeout(() => {
          setMessage("");
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setGuesses([]);
          setCurrentGuess("");
          setUsedLetters({});
        }, 1500);
      } else {
        // This was the last question, now we can end the game
        setGameOver(true);
        setShowGameOver(true);
        setMessage("You completed all words! 🏆");
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      playSoundEffect(gameOverSound);
      setGameOver(true);
      setShowGameOver(true);
      setMessage(`The word was: ${currentWord}`);
    } else {
      // Play different sounds based on how many correct letters there are
      const correctCount = statusArray.filter(
        (status) => status === "bg-success text-white"
      ).length;
      if (correctCount > 0) {
        playSoundEffect(correctSound);
      } else {
        playSoundEffect(incorrectSound);
      }
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
    <motion.div
      className={`kidwordle-wrapper ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container hint-card"
        drag
        dragConstraints={{ top: 0, left: 0, right: 300, bottom: 300 }}
        dragElastic={0.2}
      >
        <div className="outline card d-flex flex-column justify-content-center align-items-center">
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
            Question {score} of {questions.length}
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

      <AnimatePresence>
        {showGameOver && (
          <GameOver
            onClose={handleGameOverClose}
            onRetry={handleRetry}
            score={score}
            coins={coins}
          />
        )}
      </AnimatePresence>
      {/* {showGameOver && <GameOver onClose={handleCloseGameOver} />} */}
    </motion.div>
  );
};

export default KidWordle;
