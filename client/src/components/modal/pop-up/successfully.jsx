import React from "react";
import { motion } from "framer-motion";

const Successfully = ({ isOpen, onClose, characterName, characterImage }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-full"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="text-white rounded-3 shadow-lg text-center"
        style={{
          maxWidth: "500px",
          width: "90%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1b8f54",
          transform: "none", // Ensure no tilting
        }}
      >
        {/* Header with improved alignment */}
        <motion.div
          className="py-4 position-relative"
          style={{
            background: "linear-gradient(to right, #17a85e, #149253)",
            borderBottom: "4px solid rgba(255,255,255,0.2)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              letterSpacing: "1px",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              margin: 0,
              paddingRight: "50px", // Make space for close button
            }}
          >
            Character Unlocked!
          </h2>

          {/* Improved close button alignment */}
          <motion.div
            className="position-absolute"
            style={{ top: "50%", right: "15px", transform: "translateY(-50%)" }}
            onClick={onClose}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#1b8f54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#1b8f54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        <div className="py-4 px-3">
          {characterImage && (
            <motion.div
              className="character-preview mb-4"
              animate={{
                y: [0, -10, 0],
                // Remove rotation to prevent tilting
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "50%",
                padding: "20px",
                width: "180px",
                height: "180px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                transform: "none", // Ensure no tilting
              }}
            >
              <img
                src={characterImage}
                alt={characterName}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transform: "none", // Ensure no tilting
                }}
              />

              {/* Light dots around the character */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white text-dark rounded-3 py-3 px-2 mb-4"
            style={{
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transform: "none", // Ensure no tilting
            }}
          >
            <p className="text-muted mb-1" style={{ fontSize: "1rem" }}>
              You've successfully purchased
            </p>
            <p
              className="mb-1"
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#1b8f54",
              }}
            >
              {characterName}
            </p>
            <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
              Added to your collection!
            </p>
          </motion.div>

          {/* Confetti effect */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                backgroundColor: [
                  "#FF6B6B",
                  "#4ECDC4",
                  "#FFE66D",
                  "#FF8C42",
                  "#A64AC9",
                  "#17BEBB",
                ][Math.floor(Math.random() * 6)],
                top: "20%",
                left: "50%",
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: Math.random() * 0.3 + 0.7,
              }}
              animate={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 100,
                rotate: Math.random() * 360,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: Math.random() * 1.5 + 1.5,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center px-4 py-2"
              style={{
                backgroundColor: "#f0f8f4",
                color: "#1b8f54",
                borderRadius: "50px",
                fontWeight: "600",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="me-2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                  stroke="#1b8f54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 4L12 14.01L9 11.01"
                  stroke="#1b8f54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Awesome!
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Successfully;
