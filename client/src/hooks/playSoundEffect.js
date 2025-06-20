import { useAudioContext } from "../context/AudioContext";

export const usePlaySoundEffect = () => {
  const { soundEffectsEnabled } = useAudioContext();
  return (audioSrc) => {
    if (!soundEffectsEnabled) return;
    const audio = new Audio(audioSrc);
    audio.play();
  };
};
