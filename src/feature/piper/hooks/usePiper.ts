import { useEffect, useRef, useState } from 'react';
import { TtsSession } from '@realtimex/piper-tts-web';

export function usePiper(voiceId: string | null) {
  const sessionRef = useRef<TtsSession | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!voiceId) {
      sessionRef.current = null;
      setReady(false);
      setError(null);
      return;
    }

    let mounted = true;

    async function init() {
      try {
        setReady(false);
        setError(null);

        const session = await TtsSession.create({
          voiceId,
        });

        await session.init(true, 'local');

        if (!mounted) {
          return;
        }

        sessionRef.current = session;
        setReady(true);
      } catch (err) {
        console.error('Error to start Piper:', err);

        if (!mounted) {
          return;
        }

        sessionRef.current = null;
        setReady(false);

        setError(
          err instanceof Error
            ? err.message
            : 'Error starting voice',
        );
      }
    }

    init();

    return () => {
      mounted = false;
      sessionRef.current = null;
    };
  }, [voiceId]);

  /**
     * Divide el texto intentando mantener las oraciones completas.
     *
     * Si una oración supera maxLength, se divide por palabras.
     */
  const splitTextIntoChunks = (
    text: string,
    maxLength: number = 250,
  ): string[] => {
    const normalizedText = text
      .replace(/\s+/g, ' ')
      .trim();

    if (!normalizedText) {
      return [];
    }

    /*
         * Busca oraciones terminadas en:
         * .
         * !
         * ?
         *
         * También permite que la última parte no tenga puntuación.
         */
    const sentences =
            normalizedText.match(
              /[^.!?]+[.!?]+|[^.!?]+$/g,
            ) ?? [];

    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();

      if (!cleanSentence) {
        continue;
      }

      const candidate = currentChunk
        ? `${currentChunk} ${cleanSentence}`
        : cleanSentence;

      /*
             * La oración entra en el chunk actual.
             */
      if (candidate.length <= maxLength) {
        currentChunk = candidate;
        continue;
      }

      /*
             * Guardamos el chunk anterior.
             */
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      /*
             * Si la oración individual es demasiado grande,
             * la dividimos por palabras.
             */
      if (cleanSentence.length > maxLength) {
        const words = cleanSentence.split(/\s+/);

        let wordChunk = '';

        for (const word of words) {
          const candidateWord = wordChunk
            ? `${wordChunk} ${word}`
            : word;

          if (
            candidateWord.length > maxLength &&
                        wordChunk
          ) {
            chunks.push(wordChunk);
            wordChunk = word;
          } else {
            wordChunk = candidateWord;
          }
        }

        currentChunk = wordChunk;
      } else {
        currentChunk = cleanSentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  /**
     * Genera el texto por chunks.
     *
     * Cada vez que Piper termina un chunk se llama onChunk().
     *
     * Esto permite que VoiceReproducer empiece a reproducir
     * el primer chunk mientras Piper todavía genera los siguientes.
     */
  const synthesize = async (
    text: string,
    onChunk: (blob: Blob, index: number, total: number) => Promise<void> | void,
  ): Promise<void> => {
    const session = sessionRef.current;

    if (!session) {
      throw new Error('Piper is not ready.');
    }

    const chunks = splitTextIntoChunks(
      text,
      250,
    );

    if (chunks.length === 0) {
      return;
    }

    console.log(
      'Texto dividido en chunks:',
      chunks,
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (!chunk.trim()) {
        continue;
      }

      console.log(
        `Generando chunk ${i + 1}/${chunks.length}:`,
        chunk,
      );

      const wavBlob = await session.predict(
        chunk,
      );

      /*
             * Entregamos inmediatamente el audio
             * al reproductor.
             *
             * No esperamos a que termine todo el texto.
             */
      await onChunk(
        wavBlob,
        i,
        chunks.length,
      );
    }
  };

  return {
    ready,
    error,
    synthesize,
  };
}
