import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '../../../db/dbDexie';
import { useTask } from '../../task/hooks/useTask';
import { createAudioController } from '../hooks/controlAudio';
import { generateAudio } from '../hooks/generateAudio';
import type { AudioController } from '../hooks/controlAudio';

interface UseAudioPlayerParams {
  documentId: number;
  htmlContent: string;
  voiceId: string;
}

export function useAudioPlayer({ documentId, htmlContent, voiceId }: UseAudioPlayerParams) {
  const controllerRef = useRef<AudioController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { tasks, startTask } = useTask();

  const audioDocument = useLiveQuery(() => db.audioDocuments.get(documentId), [documentId]);

  const task = tasks.find((t) => t.data && 
  typeof t.data === 'object' &&
      'documentId' in t.data &&
      t.data.documentId === documentId
  );

  useEffect(() => {
    if (!audioDocument) return;

    controllerRef.current?.destroy();

    const controller = createAudioController(
      audioDocument.audio,
      setCurrentTime,
      setDuration,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    );

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [audioDocument]);

  const handleGenerate = () => {
    generateAudio({
      documentId,
      htmlContent,
      voiceId,
      startTask,
    });
  };

  const togglePlay = async () => {
    await controllerRef.current?.togglePlay();
  };

  const seek = (seconds: number) => {
    controllerRef.current?.seek(seconds);
  };

  const stop = () => {
    controllerRef.current?.stop();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleRegenerate = () => {
  generateAudio({
    documentId,
    htmlContent,
    voiceId,
    startTask,
    });
  };

  const isGenerating = task?.status === 'pending' || task?.status === 'running';
  const hasError = task?.status === 'error';
  const progress = task?.progress ?? 0;

  return {
    audioDocument,
    isPlaying,
    currentTime,
    duration,
    progress,
    isGenerating,
    hasError,
    generateAudio: handleGenerate,
    togglePlay,
    seek,
    stop,
    handleRegenerate,
  };
}