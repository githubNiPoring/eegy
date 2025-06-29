import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { playSoundEffect } from "../../../hooks/useAudio";
import GameOver from "../../modal/game-over/gameover";
import Congratulation from "../../modal/congratulations/congratulations";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";
import Cookies from "js-cookie";
import { usePlaySoundEffect } from "../../../hooks/playSoundEffect";

import coin from "../../../../public/assets/misc/coin.png";
import correctSound from "../../../../public/assets/audio/correct.mp3";
import incorrectSound from "../../../../public/assets/audio/incorrect.mp3";
import gameOverSound from "../../../../public/assets/audio/game-over.mp3";

import "./style.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Wordbuddy = () => {
  const { theme } = useTheme();
  const { width, height } = useWindowSize();
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");
  const [userLevel, setUserLevel] = useState();
  const [newUserLevel, setNewUserLevel] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);

  // Decorative emojis for the background
  const decorations = ["🍎", "🍌", "🍓", "🍊", "🥝", "🍉", "🍇"];
  const [randomEmojis, setRandomEmojis] = useState([]);

  const playSoundEffect = usePlaySoundEffect();

  useEffect(() => {
    // Set random emojis for decoration
    setRandomEmojis([
      decorations[Math.floor(Math.random() * decorations.length)],
      decorations[Math.floor(Math.random() * decorations.length)],
      decorations[Math.floor(Math.random() * decorations.length)],
    ]);
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
        setUserLevel(response.data.profile.userLevel || 1);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Function to save game results to database using your existing API
  const saveGameResults = async (gameScore, gameCoins, userLevelToSave) => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return false;
      }

      // Prepare data according to your API structure
      const gameData = {
        gameID: 1, // Word Buddy game ID
        earnedCoin: gameCoins,
        score: gameScore * 10,
        lvlReached: userLevelToSave,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/history/word-buddy`,
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
      // Log more details about the error
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveGameProfile = async (userLevel, coins, score) => {
    try {
      setIsSavingProfile(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const gameProfileData = {
        userLevel: userLevel,
        coins: coins,
        score: score,
      };

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

      if (response.data && response.data.success) {
        console.log("Game results saved successfully:", response.data.message);
        return true;
      } else {
        console.error("Failed to save game results:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error saving game profile:", error);
      // Log more details about the error
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/games/fruit`);
      const data = response.data.questions;

      // Keep the original structure instead of reformatting
      setQuestions(data);
      console.log("Fetched questions:", data);

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

  const resetGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setCoins(0);
    setShowGameOver(false);
    setMessage("");
    setShowConfetti(false);
    // Reset to first question
    if (questions.length > 0) {
      setupCurrentQuestion(0);
    }
    window.location.reload();
  };

  const handleRetry = () => {
    resetGame();
  };

  const handlePlayAgain = () => {
    resetGame();
    setShowCongratulation(false);
  };

  const handleAnswer = async (selectedWord) => {
    if (!currentWord) return;

    if (selectedWord === currentWord) {
      setIsOptionDisabled(true);
      playSoundEffect(correctSound);
      setShowConfetti(true);
      setMessage("Correct! 🎉");
      const newScore = score + 1;
      const newCoins = coins + 1;
      setScore(newScore);
      setCoins(newCoins);

      setTimeout(async () => {
        setShowConfetti(false);
        setMessage("");
        // Check if there are more questions
        if (currentWordIndex < questions.length - 1) {
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          setupCurrentQuestion(nextIndex);
        } else {
          setMessage("Congratulations! You completed all questions! 🏆");

          const MAX_LEVEL = 100;
          const newUserLevel =
            userLevel < MAX_LEVEL ? userLevel + 1 : MAX_LEVEL;

          setNewUserLevel(newUserLevel);
          // Save game results before showing congratulations modal
          const saveSuccess = await saveGameResults(
            newScore,
            newCoins,
            newUserLevel
          );

          const saveProfileSuccess = await saveGameProfile(
            newUserLevel,
            newCoins,
            newScore * 10
          );

          if (saveSuccess && saveProfileSuccess) {
            setShowCongratulation(true);
          } else {
            // Handle save failure - maybe show an error message
            console.error("Failed to save game results");
            setShowCongratulation(true); // Still show modal even if save fails
          }
        }
        setIsOptionDisabled(false);
      }, 2000);
    } else {
      playSoundEffect(incorrectSound);
      setMessage("Wrong answer! ❌");

      // Add shake animation
      const container = document.querySelector(".game-container");
      if (container) {
        container.classList.add("shake");
        setTimeout(() => {
          container.classList.remove("shake");
        }, 1000);
      }

      // Save game results before showing game over modal
      setTimeout(async () => {
        playSoundEffect(gameOverSound);

        // Save game results (game over - not completed)
        const saveSuccess = await saveGameResults(score, coins, userLevel);
        const saveProfileSuccess = await saveGameProfile(
          userLevel,
          coins,
          score * 10
        );
        if (saveSuccess && saveProfileSuccess) {
          setShowGameOver(true);
        } else {
          // Handle save failure
          console.error("Failed to save game results");
          setShowGameOver(true); // Still show modal even if save fails
        }
      }, 500);
    }
  };

  const handleCloseGameOver = () => {
    // This will navigate to homepage (handled in GameOver component)
    setShowGameOver(false);
  };

  const handleCloseModal = () => {
    setShowCongratulation(false);
  };

  return (
    <div className={`game-wrapper ${theme} p-1`}>
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
              Question {currentWordIndex + 1} of
              {questions.length}
            </div>
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
                    disabled={isOptionDisabled || isSaving || isSavingProfile}
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

        {(loading || isSaving || isSavingProfile) && (
          <div className="loading">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="loading-spinner"
            />
            <p>{loading ? "Loading questions..." : "Saving results..."}</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showGameOver && (
          <GameOver
            onClose={handleCloseGameOver}
            onRetry={handleRetry}
            score={score}
            coins={coins}
            userLevel={userLevel}
          />
        )}
        {showCongratulation && (
          <Congratulation
            onClose={handleCloseModal}
            onPlayAgain={handlePlayAgain}
            score={score}
            coins={coins}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wordbuddy;
