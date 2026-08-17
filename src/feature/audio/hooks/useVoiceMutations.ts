import { useCallback, useEffect, useState } from 'react';
import { deleteAllVoices, deleteVoice, downloadVoice, getInstalledVoiceIds } from '../services/voiceService';
import { voiceCatalog } from '../types/voice';

export function useVoiceMutations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  const checkInstalled = useCallback(async () => {
    try {
      const stored = await getInstalledVoiceIds();
      setInstalledIds(stored);
    } catch (error) {
      console.error('Error reading TTS cache:', error);
    }
  }, []);

  useEffect(() => {
    checkInstalled();
  }, [checkInstalled]);

  const availableVoices = Object.entries(voiceCatalog).map(([key, voice]) => ({
    ...voice,
    key,
    isInstalled: installedIds.includes(voice.id),
  }));

  const installedVoices = availableVoices
    .filter((voice) => voice.isInstalled)
    .map((voice) => ({
      id: voice.id,
      name: voice.name,
    }));

  const downloadById = async (id: string) => {
    setIsProcessing(true);
    try {
      await downloadVoice(id);
      await checkInstalled();
    } catch (error) {
      throw new Error('Download failed', { cause: error });
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteById = async (id: string) => {
    setIsProcessing(true);
    try {
      await deleteVoice(id);
      await checkInstalled();
    } catch (error) {
      throw new Error('Delete failed', { cause: error });
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteAll = async () => {
    setIsProcessing(true);
    try {
      await deleteAllVoices();
      await checkInstalled();
    } catch (error) {
      throw new Error('Delete all failed', { cause: error });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    availableVoices,
    installedVoices,
    downloadById,
    deleteById,
    deleteAll,
  };
}