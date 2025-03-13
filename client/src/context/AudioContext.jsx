import React, { createContext, useContext, useState, useEffect } from "react";
import { useAudio } from "../hooks/useAudio";
import backgroundMusic from "../assets/audio/background-music.mp3";

const AudioContext = createContext();

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  // Initialize from localStorage, default to true if not set
  const [shouldAutoplay, setShouldAutoplay] = useState(() => {
    const savedPreference = localStorage.getItem("backgroundMusicEnabled");
    return savedPreference === null ? true : savedPreference === "true";
  });

  const { playing, toggle, play, pause } = useAudio(
    backgroundMusic,
    shouldAutoplay
  );

  // Update localStorage when preference changes
  useEffect(() => {
    localStorage.setItem("backgroundMusicEnabled", shouldAutoplay);
    if (shouldAutoplay) {
      play();
    } else {
      pause();
    }
  }, [shouldAutoplay, play, pause]);

  const startMusic = () => {
    if (shouldAutoplay) {
      play();
    }
  };

  const stopMusic = () => {
    pause();
  };

  const toggleMusicPreference = () => {
    setShouldAutoplay(!shouldAutoplay);
  };

  return (
    <AudioContext.Provider
      value={{
        playing,
        toggle,
        startMusic,
        stopMusic,
        isMusicEnabled: shouldAutoplay,
        toggleMusicPreference,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
