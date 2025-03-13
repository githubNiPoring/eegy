import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AudioProvider, useAudioContext } from "./context/AudioContext";
// import axios from "axios";

import Notfound from "./components/404page/404";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Homepage from "./components/Homepage/Homepage";
import EmailVerification from "./components/Verification/EmailVerification";

// games
import WordBuddy from "./components/games/word_buddy/word_buddy";
import Alphabet from "./components/games/alphabet/alphabet";
import KidWordle from "./components/games/kid-wordle/kid-wordle";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

const AudioControls = () => {
  const { playing, isMusicEnabled, toggleMusicPreference } = useAudioContext();

  return (
    <div className="audio-controls">
      <button
        onClick={toggleMusicPreference}
        className="music-toggle"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
        }}
        title={
          isMusicEnabled
            ? "Turn off background music"
            : "Turn on background music"
        }
      >
        {isMusicEnabled ? "🔊" : "🔈"}
      </button>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AudioControls />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Navigate to="/homepage" />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route
            path="/verify/:userId/:token"
            element={<EmailVerification />}
          ></Route>
          <Route path="/word-buddy" element={<WordBuddy />}></Route>
          <Route path="/alphabet" element={<Alphabet />}></Route>
          <Route path="/kid-wordle" element={<KidWordle />}></Route>
          <Route path="*" element={<Notfound />}></Route>
        </Routes>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
