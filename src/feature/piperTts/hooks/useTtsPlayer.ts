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

  const generationIdRef = useRef(0);

  const mountedRef = useRef(true);

  const playChunkRef = useRef<(index: number) => void>(() => {});

  const cleanupAudio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    audio.onpause = null;
    audio.onplay = null;

    if (audio.src.startsWith('blob:')) {
      URL.revokeObjectURL(audio.src);
    }

    audio.removeAttribute('src');
    audio.load();

    audioRef.current = null;
  }, []);

  const playChunk = useCallback(
    (index: number) => {
      if (!mountedRef.current) return;

      if (index < 0 || index >= chunksRef.current.length) {
        cleanupAudio();

        setIsPlaying(false);
        setIsWaiting(false);

        return;
      }

      cleanupAudio();

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

      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        if (!mountedRef.current) return;

        playChunkRef.current(index + 1);
      };

      audio.onerror = () => {
        if (!mountedRef.current) return;

        console.error(`Error playing chunk ${index}`);

        setIsPlaying(false);
        setIsWaiting(false);
      };

      audio.play().catch((error) => {
        if (!mountedRef.current) return;

        console.error('Playback error:', error);

        setIsPlaying(false);
        setIsWaiting(false);
      });
    },
    [cleanupAudio],
  );

  useEffect(() => {
    playChunkRef.current = playChunk;
  }, [playChunk]);

  const generateAllInBackground = useCallback(
    async ( chunks: string[], voiceId: string, generationId: number ) => {
      for (let i = 0; i < chunks.length; i++) {
        if ( !mountedRef.current || generationId !== generationIdRef.current
        ) {
          return;
        }

        if (playlistRef.current[i] !== null) {
          continue;
        }

        const blob = await generateAudioChunk(chunks[i], voiceId);

        if (!mountedRef.current || generationId !== generationIdRef.current) {
          return;
        }

        playlistRef.current[i] = blob;

        if (i === currentIndex && audioRef.current === null && blob !== null) {
          playChunkRef.current(i);
        }
      }
    },
    [generateAudioChunk, currentIndex],
  );

  const loadAndPlay = useCallback(
    (chunks: string[], voiceId: string) => {
      if (!mountedRef.current) return;

      if (chunks.length === 0) return;

      generationIdRef.current++;

      const generationId = generationIdRef.current;
      cleanupAudio();

      playlistRef.current = new Array(chunks.length).fill(null);

      chunksRef.current = chunks;
      voiceRef.current = voiceId;

      setTotalChunks(chunks.length);
      setCurrentIndex(0);
      setIsPlaying(true);
      setIsWaiting(true);

      generateAllInBackground(chunks, voiceId, generationId);
    },
    [cleanupAudio, generateAllInBackground],
  );

  // === CONTROLES DE REPRODUCCIÓN ===

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || isWaiting) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio .play().then(() => {
        if (!mountedRef.current) return;
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Playback error:', error);
      });
    }
  }, [isPlaying, isWaiting]);

  const playNext = useCallback(() => {
    playChunk(currentIndex + 1);
  }, [currentIndex, playChunk]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 2) {
      audio.currentTime = 0;
      return;
    }

    playChunk(currentIndex - 1);
  }, [currentIndex, playChunk]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      generationIdRef.current++;

      cleanupAudio();

      playlistRef.current = [];
      chunksRef.current = [];
      voiceRef.current = '';
    };
  }, [cleanupAudio]);

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
