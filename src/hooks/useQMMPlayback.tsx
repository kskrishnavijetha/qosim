
import { useState, useCallback, useEffect, useRef } from 'react';

interface QMMPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
}

export function useQMMPlayback(maxTime: number = 10) {
  const [state, setState] = useState<QMMPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    playbackSpeed: 1
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, currentTime: 0, isPlaying: false }));
  }, []);

  const stepForward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTime: Math.min(maxTime, prev.currentTime + 0.1)
    }));
  }, [maxTime]);

  const stepBackward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTime: Math.max(0, prev.currentTime - 0.1)
    }));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      currentTime: Math.max(0, Math.min(maxTime, time))
    }));
  }, [maxTime]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, playbackSpeed: speed }));
  }, []);

  // Playback effect
  useEffect(() => {
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + (0.1 * prev.playbackSpeed);
          if (newTime >= maxTime) {
            return { ...prev, currentTime: maxTime, isPlaying: false };
          }
          return { ...prev, currentTime: newTime };
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying, state.playbackSpeed, maxTime]);

  return {
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    playbackSpeed: state.playbackSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setCurrentTime,
    setPlaybackSpeed
  };
}
