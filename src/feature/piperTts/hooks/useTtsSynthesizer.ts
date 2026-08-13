import { useState, useCallback } from 'react';
import * as tts from '@realtimex/piper-tts-web';

export function useTtsSynthesizer() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAudioChunk = useCallback(
    async ( text: string, voiceId: string ): Promise<Blob | null> => {
      setIsGenerating(true);

      try {
        const buffer = await tts.predict({ text, voiceId });

        return new Blob( [buffer], { type: 'audio/wav' } );
      } catch (error) {
        console.error('Error generating TTS:', error);
        return null;
      } finally {
        setIsGenerating(false);
      }
    }, [],
  );

  return {
    isGenerating,
    generateAudioChunk,
  };
}
