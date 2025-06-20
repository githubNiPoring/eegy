import React, { createContext, useContext, useState, useEffect } from "react";
import { useAudio } from "../hooks/useAudio";
// import backgroundMusic from "../assets/audio/background-music.mp3";
import backgroundMusic from "../../public/assets/audio/background-music.mp3";

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

  useEffect(() => {
    localStorage.setItem("backgroundMusicEnabled", shouldAutoplay);
    if (!shouldAutoplay) pause();
  }, [shouldAutoplay, pause]);
  // Update localStorage when preference changes
  // useEffect(() => {
  //   localStorage.setItem("backgroundMusicEnabled", shouldAutoplay);
  //   if (shouldAutoplay) {
  //     play();
  //   } else {
  //     pause();
  //   }
  // }, [shouldAutoplay, play, pause]);

  useEffect(() => {
    if (!shouldAutoplay) return;
    const resumeMusic = () => {
      play();
      window.removeEventListener("pointerdown", resumeMusic);
      window.removeEventListener("keydown", resumeMusic);
    };
    window.addEventListener("pointerdown", resumeMusic);
    window.addEventListener("keydown", resumeMusic);
    return () => {
      window.removeEventListener("pointerdown", resumeMusic);
      window.removeEventListener("keydown", resumeMusic);
    };
  }, [shouldAutoplay, play]);

  const toggleMusicPreference = () => setShouldAutoplay((prev) => !prev);
  // const startMusic = () => {
  //   if (shouldAutoplay) {
  //     play();
  //   }
  // };

  // const stopMusic = () => {
  //   pause();
  // };

  // const toggleMusicPreference = () => {
  //   setShouldAutoplay(!shouldAutoplay);
  // };

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEffectsEnabled");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("soundEffectsEnabled", soundEffectsEnabled);
  }, [soundEffectsEnabled]);

  return (
    <AudioContext.Provider
      value={{
        playing,
        isMusicEnabled: shouldAutoplay,
        toggleMusicPreference,
        soundEffectsEnabled,
        setSoundEffectsEnabled,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
