import { useState } from 'react';
import { download, remove } from '@realtimex/piper-tts-web';
import { voiceService } from '../service/voiceService';

export const useDownloadVoice = () => {
  const [isDownloading, setIsDownloading] =
        useState(false);

  const [error, setError] = useState<string | null>(null);

  const downloadVoice = async ( id: string, name: string ) => {
    setIsDownloading(true);
    setError(null);

    try {
      await download(id);
      await voiceService.save({ id, name });
      return true;
    } catch (err) {
      console.error('Error downloading voice:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error downloading voice:';
      setError(errorMessage);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteVoice = async (id: string) => {
    try {
      await remove(id);
      await voiceService.delete(id);
      return true;
    } catch (err) {
      console.error('Error deleting voice:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error deleting voice';
      setError(errorMessage);
      return false;
    }
  };

  return {
    downloadVoice,
    deleteVoice,
    isDownloading,
    error,
  };
};

