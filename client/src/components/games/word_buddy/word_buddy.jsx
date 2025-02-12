import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

import GameOver from "../../modal/game-over/gameover";

import apple from "../../../assets/game-icons/apple.png";
import coin from "../../../assets/coin.png";

import "./style.css";

const Wordbuddy = () => {
  const [showGameOver, setShowGameOver] = useState(false);

  const handleGameOver = (e) => {
    e.preventDefault();
    setShowGameOver(true);
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
  };
  return (
    <>
      <div className="container">
        <div className="character-header">
          <h1 className="text-center rounded-3 p-2">Word Buddy</h1>
        </div>
      </div>
      <div className="container mt-5">
        <div className="card shadow bg-color">
          <div className="nav d-flex align-items-center justify-content-end m-2 mx-5">
            <img src={coin} alt="coin" className="coin-size" />
            <p className="m-0 ms-1">100</p>
            <p className="m-0 ms-4">Score: 100</p>
          </div>
          <div className="container d-flex justify-content-center my-5">
            <div className="card shadow d-flex justify-content-center align-items-center w-50">
              <img src={apple} className="question-icon" alt="" />
            </div>
          </div>
          <div className="container d-flex justify-content-around pad-10 mb-3">
            <motion.a
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              whileTap={{ scale: 0.9 }}
              href="#"
              className="btn btn-primary btn-lg"
            >
              Apple
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              whileTap={{ scale: 0.9 }}
              href=""
              className="btn btn-primary btn-lg"
              onClick={handleGameOver}
            >
              Carrots
            </motion.a>
          </div>
        </div>
      </div>
      {showGameOver && <GameOver onClose={handleCloseGameOver} />}
    </>
  );
};

export default Wordbuddy;
