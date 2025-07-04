import React from "react";

const CloseGameModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "32px 28px 24px 28px",
          minWidth: 320,
          maxWidth: "90vw",
          boxShadow: "0 6px 32px rgba(0,0,0,0.18)",
        }}
      >
        <h4 className="mb-3" style={{ color: "#ffb300" }}>
          Close Game?
        </h4>
        <p style={{ color: "#b85c00", fontWeight: 500 }}>
          If you close the game now,{" "}
          <span style={{ color: "#ffb300" }}>your coins will not be saved</span>
          .<br />
          Are you sure you want to exit?
        </p>
        <div className="d-flex justify-content-end mt-4 gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={onCancel}
            style={{ minWidth: 80 }}
          >
            No
          </button>
          <button
            className="btn btn-warning"
            onClick={onConfirm}
            style={{ minWidth: 80, color: "#fff", fontWeight: "bold" }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseGameModal;
