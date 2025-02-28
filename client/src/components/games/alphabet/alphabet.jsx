import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const WORDS = [
  { word: "APPLE", hint: "A red fruit" },
  { word: "ZEBRA", hint: "A black and white striped animal" },
  { word: "HOUSE", hint: "A place where people live" },
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
  const { width, height } = useWindowSize();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORDS[currentIndex].word);
  const [hint, setHint] = useState(WORDS[currentIndex].hint);
  const [missingIndexes, setMissingIndexes] = useState(
    getRandomMissingIndexes(currentWord)
  );
  const [userInput, setUserInput] = useState(
    currentWord
      .split("")
      .map((letter, index) => (missingIndexes.includes(index) ? "" : letter))
  );
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [fall, setFall] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    setMissingIndexes(getRandomMissingIndexes(currentWord));
    setUserInput(
      currentWord
        .split("")
        .map((letter, index) => (missingIndexes.includes(index) ? "" : letter))
    );
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [currentWord]);

  const handleDrop = (event, index) => {
    event.preventDefault();
    const letter = event.dataTransfer.getData("text").toUpperCase();
    let newInput = [...userInput];
    newInput[index] = letter;
    setUserInput(newInput);
  };

  const handleDragStart = (event, letter) => {
    event.dataTransfer.setData("text", letter);
  };

  const checkAnswer = () => {
    if (userInput.join("") === currentWord) {
      setMessage("Correct! 🎉");
      setShake(false);
      setFall(false);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        let nextIndex = (currentIndex + 1) % WORDS.length;
        setCurrentIndex(nextIndex);
        setCurrentWord(WORDS[nextIndex].word);
        setHint(WORDS[nextIndex].hint);
        setMissingIndexes(getRandomMissingIndexes(WORDS[nextIndex].word));
        setUserInput(
          WORDS[nextIndex].word
            .split("")
            .map((letter, index) =>
              missingIndexes.includes(index) ? "" : letter
            )
        );
        setMessage("");
      }, 2000);
    } else {
      setMessage("Try again! ❌");
      setShake(true);
      setFall(true);
      setTimeout(() => {
        setShake(false);
        setFall(false);
        setUserInput(
          currentWord
            .split("")
            .map((letter, index) =>
              missingIndexes.includes(index) ? "" : letter
            )
        );
      }, 1000);
    }
  };

  return (
    <div
      className={`container text-center mt-4 ${
        shake ? "animate__animated animate__shakeX" : ""
      }`}
      style={{
        backgroundColor: "#fbe7c6",
        padding: "20px",
        borderRadius: "15px",
      }}
    >
      {showConfetti && <Confetti width={width} height={height} />}
      <h1 style={{ color: "#ff69b4", fontFamily: "Comic Sans MS" }}>
        Alphabet Completion Game
      </h1>
      <p className="lead" style={{ color: "#ff4500" }}>
        Hint: {hint}
      </p>
      <div
        className={`mb-3 d-flex justify-content-center ${
          fall ? "animate__animated animate__fadeOutDown" : ""
        }`}
      >
        {userInput.map((char, index) => (
          <div
            key={index}
            className="border rounded text-center mx-1 d-flex align-items-center justify-content-center"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "30px",
              backgroundColor: "#ffdd57",
              color: "#333",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
          >
            {char}
          </div>
        ))}
      </div>
      <div
        className="mb-3 p-3 d-flex flex-column align-items-center"
        style={{ backgroundColor: "#a0e7e5", borderRadius: "15px" }}
      >
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex justify-content-center mb-2">
            {row.map((letter) => (
              <div
                key={letter}
                className="border p-3 mx-1 text-center d-flex align-items-center justify-content-center"
                style={{
                  cursor: "grab",
                  fontSize: "24px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  borderRadius: "10px",
                  width: "50px",
                  height: "50px",
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary mt-3"
        style={{ backgroundColor: "#ff69b4", borderColor: "#ff1493" }}
        onClick={checkAnswer}
      >
        Check
      </button>
      <p className="mt-3 fw-bold" style={{ color: "#ff4500" }}>
        {message}
      </p>
    </div>
  );
};

export default Alphabet;
