import React from "react";

const AchievementClaim = ({ show, onClose, achievement }) => {
  if (!show || !achievement) return null;

  const handleOk = () => {
    window.location.reload();
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="achievement-claim-modal"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "350px",
          width: "90%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <img
          src={achievement.iconUrl}
          alt={achievement.title}
          style={{ width: 90, height: 90, marginBottom: 16 }}
        />
        <h3 style={{ marginBottom: 8 }}>{achievement.title}</h3>
        <p style={{ marginBottom: 16 }}>{achievement.description}</p>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#FFD700",
            marginBottom: 24,
          }}
        >
          +{achievement.coinReward} Coins
        </div>
        <button
          className="btn btn-warning"
          style={{
            borderRadius: "20px",
            padding: "0.5rem 2rem",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
          onClick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AchievementClaim;
