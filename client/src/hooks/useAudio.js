import { useState, useEffect } from "react";

export const useAudio = (audioSrc, autoplay = false) => {
  const [audio] = useState(new Audio(audioSrc));
  const [playing, setPlaying] = useState(autoplay);

  const toggle = () => setPlaying(!playing);

  const play = () => {
    audio.play();
    setPlaying(true);
  };

  const pause = () => {
    audio.pause();
    setPlaying(false);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();

    return () => {
      audio.pause();
    };
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });
    return () => {
      audio.removeEventListener("ended", () => {});
    };
  }, [audio]);

  // Initial autoplay
  useEffect(() => {
    if (autoplay) {
      // Most browsers require user interaction before playing audio
      // We'll try to play and handle any errors silently
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, we'll let the user toggle manually
          setPlaying(false);
        });
      }
    }
  }, [audio, autoplay]);

  return { playing, toggle, play, pause };
};

export const playSoundEffect = (audioSrc) => {
  const audio = new Audio(audioSrc);
  audio.play();
};
