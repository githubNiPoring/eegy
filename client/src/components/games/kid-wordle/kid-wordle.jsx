import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import GameOver from "../../modal/game-over/gameover";
import "./style.css";

const WORD = "POWER"; // Change this word to set the correct answer
const MAX_GUESSES = 5;
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "Backspace", "Enter"],
];

const KidWordle = () => {
  const { theme } = useTheme();
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [usedLetters, setUsedLetters] = useState({});
  const [invalidWord, setInvalidWord] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleGameOver = (e) => {
    e.preventDefault();
    setShowGameOver(true);
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => handleInput(e.key);
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, gameOver]);

  const checkValidWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleInput = (key) => {
    if (gameOver) return;
    if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD.length) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
      setInvalidWord(false);
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      setInvalidWord(false);
    } else if (key === "Enter" && currentGuess.length === WORD.length) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (currentGuess.length !== WORD.length || gameOver) return;

    const isValid = await checkValidWord(currentGuess.toLowerCase());
    if (!isValid) {
      setInvalidWord(true);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    const newUsedLetters = { ...usedLetters };
    const statusArray = getLetterStatus(WORD, currentGuess);
    currentGuess.split("").forEach((letter, index) => {
      if (newUsedLetters[letter] !== "bg-success text-white") {
        newUsedLetters[letter] = statusArray[index];
      }
    });
    setUsedLetters(newUsedLetters);

    if (currentGuess === WORD || newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
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
    const status = getLetterStatus(WORD, guess)[index];
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

  return (
    <motion.div
      className={`kidwordle-wrapper ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
                  ? currentGuess.padEnd(WORD.length, " ")
                  : " ".repeat(WORD.length))
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

      {gameOver && <GameOver onClose={handleCloseGameOver} />}
    </motion.div>
  );
};

export default KidWordle;
