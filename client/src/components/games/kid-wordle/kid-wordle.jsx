import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import GameOver from "../../modal/game-over/gameover";

const WORD = "POWER"; // Change this word to set the correct answer
const MAX_GUESSES = 5;
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "Backspace", "Enter"],
];

const KidWordle = () => {
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

  return (
    <div className="container text-center mt-4">
      <h1>KidWordle</h1>
      {[...Array(MAX_GUESSES)].map((_, i) => (
        <div key={i} className="d-flex justify-content-center mb-2">
          {(
            guesses[i] ||
            (i === guesses.length
              ? currentGuess.padEnd(WORD.length, " ")
              : " ".repeat(WORD.length))
          )
            .split("")
            .map((letter, j) => (
              <span
                key={j}
                className={`p-3 border border-3 rounded mx-1 text-uppercase fw-bold d-inline-flex align-items-center justify-content-center ${
                  guesses[i]
                    ? getLetterStatus(WORD, guesses[i])[j]
                    : "text-muted bg-light"
                }`}
                style={{ width: "50px", height: "50px", fontSize: "24px" }}
              >
                {letter}
              </span>
            ))}
        </div>
      ))}
      {invalidWord && <p className="text-danger">Invalid word! Try again.</p>}
      {/* {gameOver && (
        <p className="mt-3">
          Game Over! The word was <strong>{WORD}</strong>
        </p>
      )} */}
      {gameOver && <GameOver onClose={handleCloseGameOver} />}
      {/* {showGameOver && <GameOver onClose={handleCloseGameOver} />} */}

      <div className="mt-3">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="d-flex justify-content-center mb-2">
            {row.map((key) => (
              <button
                key={key}
                className={`btn m-1 text-uppercase ${
                  usedLetters[key] || "btn-light"
                }`}
                style={{
                  width: key.length > 1 ? "80px" : "50px",
                  height: "50px",
                  backgroundColor: "lightgray",
                  border: "1px solid darkgray",
                }}
                onClick={() => handleInput(key)}
              >
                {key === "Backspace" ? "⌫" : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KidWordle;
