import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import coin from "../../../../public/assets/misc/coin.png";

const Congratulation = ({ onClose, onPlayAgain, score, coins, userLevel }) => {
  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate("/home");
  };

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    }
  };

  return (
    <div
      className="modal-full"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-success text-white p-4 rounded-3 shadow-lg text-center"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <div className="py-4">
          <h2 className="display-4 mb-3">Congrats!</h2>

          {(score !== undefined || coins !== undefined) && (
            <div className="bg-white text-dark rounded py-3 mb-4">
              {score !== undefined && (
                <div className="mb-2">
                  <p className="text-muted mb-1">Score</p>
                  <p className="h4">{score}</p>
                </div>
              )}
              {coins !== undefined && (
                <div>
                  <p className="text-muted mb-1">Coins Earned</p>
                  <p className="h3 text-warning d-flex align-items-center justify-content-center">
                    <img src={coin} alt="coin" width="30" className="me-2" />
                    {coins}
                  </p>
                </div>
              )}
              {userLevel !== undefined && (
                <div>
                  <p className="text-muted mb-1">Your Level</p>
                  <p className="h3 text-primary">{userLevel}</p>
                </div>
              )}
            </div>
          )}

          <p className="lead mb-4">Wow! You got it right! Keep going!</p>

          <div>
            <button
              className="btn btn-light me-2 text-success"
              onClick={handlePlayAgain}
            >
              Play again
            </button>
            <button
              className="btn btn-outline-light"
              onClick={handleCloseModal}
            >
              Go Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Congratulation;
