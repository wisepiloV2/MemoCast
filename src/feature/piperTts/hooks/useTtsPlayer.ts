import { useState, useRef, useCallback, useEffect } from 'react';

export function useTtsPlayer(generateAudioChunk: (text: string, voiceId: string) => Promise<Blob | null>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const playlistRef = useRef<(Blob | null)[]>([]);
  const chunksRef = useRef<string[]>([]);
  const voiceRef = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const playChunkRef = useRef<(index: number) => void>(() => {});

  const playChunk = useCallback((index: number) => {
    if (index < 0 || index >= chunksRef.current.length) {
      setIsPlaying(false); 
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }

    setCurrentIndex(index);
    const blob = playlistRef.current[index];

    if (!blob) {
      setIsWaiting(true);
      setIsPlaying(true);
      return;
    }

    setIsWaiting(false);
    setIsPlaying(true);

    const audioUrl = URL.createObjectURL(blob);
    audioRef.current = new Audio(audioUrl);

    audioRef.current.onended = () => {
      playChunkRef.current(index + 1);
    };

    audioRef.current.play().catch(e => console.error('Playback error:', e));
  }, []);

  useEffect(() => {
    playChunkRef.current = playChunk;
  }, [playChunk]);

  const generateAllInBackground = useCallback(async (chunks: string[], voiceId: string) => {
    for (let i = 0; i < chunks.length; i++) {
      if (playlistRef.current[i] !== null) continue; 

      const blob = await generateAudioChunk(chunks[i], voiceId);
      playlistRef.current[i] = blob;

      setCurrentIndex((currIdx) => {
        if (currIdx === i && audioRef.current?.paused !== false) {
          playChunk(i);
        }
        return currIdx;
      });
    }
  }, [generateAudioChunk, playChunk]);

  const loadAndPlay = useCallback((chunks: string[], voiceId: string) => {
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    voiceRef.current = voiceId;
    playlistRef.current = new Array(chunks.length).fill(null);
    setTotalChunks(chunks.length);
    setCurrentIndex(0);
        
    generateAllInBackground(chunks, voiceId);
        
    playChunk(0);
  }, [generateAllInBackground, playChunk]);

  // === CONTROLES DE REPRODUCCIÓN ===

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    playChunk(currentIndex + 1);
  }, [currentIndex, playChunk]);

  const playPrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 2) {
      playChunk(currentIndex); 
    } else {
      playChunk(currentIndex - 1);
    }
  }, [currentIndex, playChunk]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return {
    loadAndPlay,
    togglePlayPause,
    playNext,
    playPrevious,
    isPlaying,
    isWaiting,
    currentIndex,
    totalChunks,
  };
}
