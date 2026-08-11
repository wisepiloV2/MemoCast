import { useEffect, useRef, useState } from 'react';
import { TtsSession } from '@realtimex/piper-tts-web';
import * as ort from 'onnxruntime-web';

const VOICE_ID = 'en_US-lessac-medium';

export function usePiper() {
  const sessionRef = useRef<TtsSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      // Usa los WASM locales (copiados a public/ort)
      ort.env.wasm.wasmPaths = '/ort/';

      const session = await TtsSession.create({
        voiceId: VOICE_ID,
      });

      // Inicializa permitiendo modelos locales
      await session.init(true, 'local');

      if (mounted) {
        sessionRef.current = session;
        setReady(true);
      }
    }

    init().catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  const synthesize = async (text: string): Promise<Blob> => {
    if (!sessionRef.current) {
      throw new Error('Piper not ready');
    }

    return await sessionRef.current.predict(text);
  };

  return {
    ready,
    synthesize,
  };
}