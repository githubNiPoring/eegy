import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GameOver = ({ onClose, score, highScore }) => {
  const navigate = useNavigate();

  const handleCloseGameOver = () => {
    navigate("/home");
  };
  return (
    <div className="modal-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-danger text-white p-4 rounded-3 shadow-lg text-center"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <div className="py-4">
          <h2 className="display-4 mb-3">Game Over!</h2>

          {score !== undefined && (
            <div className="bg-white text-dark rounded py-3 mb-4">
              <p className="text-muted mb-1">Your Score</p>
              <p className="h3 text-danger">{score}</p>
              {highScore && (
                <p className="small text-secondary">High Score: {highScore}</p>
              )}
            </div>
          )}

          <p className="lead mb-4">Don't give up! You're getting better.</p>

          <div>
            <button
              className="btn btn-light me-2 text-danger"
              onClick={onClose}
            >
              Retry
            </button>
            <button
              className="btn btn-outline-light"
              onClick={handleCloseGameOver}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOver;
