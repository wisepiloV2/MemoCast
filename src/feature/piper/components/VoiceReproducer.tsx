import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../component/Button/Button';
import { usePiper } from '../hooks/usePiper';
import { useVoiceManager } from '../hooks/useVoiceManager';
import styles from './VoiceReproducer.module.css';

interface VoiceReproducerProps {
    text: string;
}

export function VoiceReproducer({ text }: VoiceReproducerProps) {
  const {
    installedVoices: voices,
    selectedVoiceId,
    setSelectedVoiceId,
  } = useVoiceManager();

  const {
    ready,
    error,
    synthesize,
  } = usePiper(selectedVoiceId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  /*
     * ==========================================
     * REFERENCIAS
     * ==========================================
     */

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const generationIdRef = useRef(0);
  const isGeneratingRef = useRef(false);

  /*
     * ==========================================
     * LIMPIEZA
     * ==========================================
     */

  useEffect(() => {
    return () => {
      generationIdRef.current++;
      audioRef.current?.pause();
      audioRef.current = null;

      for (const url of queueRef.current) {
        URL.revokeObjectURL(url);
      }
            
      queueRef.current = [];
    };
  }, []);

  useEffect(() => {
    stop();

    setIsGenerating(false);
  }, [selectedVoiceId]);

  /*
     * ==========================================
     * HTML → TEXTO
     * ==========================================
     */

  function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString( html, 'text/html' );
    return doc.body.textContent || '';
  }

  /*
     * ==========================================
     * REPRODUCIR SIGUIENTE CHUNK
     * ==========================================
     */

  const playNext = async () => {
    /*
         * Si el usuario pausó, no seguimos.
         */
    if (isPausedRef.current) {
      return;
    }

    /*
         * Si no hay elementos en la cola,
         * todavía puede ser que Piper esté generando.
         */
    const nextUrl = queueRef.current.shift();

    if (!nextUrl) {
      /*
             * Si ya terminó la generación,
             * entonces realmente terminó todo.
             */
      if (!isGeneratingRef.current) {
        isPlayingRef.current = false;
        setIsPlaying(false);
      }

      return;
    }

    /*
         * Creamos el audio si todavía no existe.
         */
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    /*
         * Liberamos la URL anterior cuando termina.
         */
    const previousUrl = audio.src;

    if (previousUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previousUrl);
    }

    audio.src = nextUrl;
    audio.playbackRate = playbackRate;

    /*
         * Cuando termina este chunk,
         * buscamos el siguiente.
         */
    audio.onended = async () => {
      URL.revokeObjectURL(nextUrl);

      /*
             * Si hay otro chunk en la cola,
             * continúa inmediatamente.
             */
      await playNext();
    };

    audio.onpause = () => {
      /*
             * No marcamos como pausado si simplemente
             * terminó el audio.
             */
      if (!audio.ended) {
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    };

    audio.onplay = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
    };

    try {
      await audio.play();
    } catch (err) {
      console.error(
        'Error playing audio:',
        err,
      );
    }
  };

  /*
     * ==========================================
     * AGREGAR CHUNK A LA COLA
     * ==========================================
     */

  const addChunkToQueue = async (
    blob: Blob,
    generationId: number,
  ) => {
    /*
         * Si pertenece a una generación anterior,
         * lo ignoramos.
         */
    if ( generationId !== generationIdRef.current) { return; }
    const url = URL.createObjectURL(blob);
    queueRef.current.push(url);

    if ( !isPlayingRef.current && !isPausedRef.current) { await playNext(); }
  };

  /*
     * ==========================================
     * SPEAK
     * ==========================================
     */

  const speak = async () => {
    if (!selectedVoiceId || !ready) { return; }

    if ( audioRef.current && isPausedRef.current) {
      isPausedRef.current = false;
      try {
        await audioRef.current.play(); 
        isPlayingRef.current = true;
        setIsPlaying(true);
      } catch (err) {
        console.error('Resume error:', err);
      }
      return;
    }

    const plainText = stripHtml(text);

    if (!plainText.trim()) { return; }

    /*
         * Nueva generación.
         */
    const generationId = ++generationIdRef.current;

    /*
         * Limpiamos cualquier cola anterior.
         */
    for (const url of queueRef.current) { URL.revokeObjectURL(url);  }
    queueRef.current = [];

    /*
         * Detenemos audio anterior.
         */
    audioRef.current?.pause();

    if (audioRef.current) { audioRef.current.src = ''; }

    isPausedRef.current = false;
    isPlayingRef.current = false;
    isGeneratingRef.current = true;

    setIsPlaying(false);
    setIsGenerating(true);

    try {
      await synthesize(
        plainText,
        async ( blob, index, total,
        ) => {
          console.log( `Chunk recibido ${index + 1}/${total}`);
          await addChunkToQueue( blob, generationId );
        },
      );
    } catch (err) { 
      /*
             * Si fue una generación vieja,
             * ignoramos el error.
             */
      if ( generationId !== generationIdRef.current ) { return; }

      console.error( 'Synthesis error:', err );
    } finally {
      /*
             * Solo modificamos el estado si esta
             * sigue siendo la generación actual.
             */
      if ( generationId === generationIdRef.current
      ) { isGeneratingRef.current = false;
        setIsGenerating(false);

        /*
                 * Puede ocurrir que el último chunk
                 * haya llegado pero todavía no haya
                 * comenzado a reproducirse.
                 */
        if (
          !isPlayingRef.current &&
                    !isPausedRef.current &&
                    queueRef.current.length > 0
        ) {
          await playNext();
        }

        /*
                 * Si no queda nada, terminó todo.
                 */
        if (
          queueRef.current.length === 0 &&
                    !isPlayingRef.current
        ) {
          setIsPlaying(false);
        }
      }
    }
  };

  /*
     * ==========================================
     * PLAY / PAUSE
     * ==========================================
     */

  const togglePlay = async () => {
    const audio = audioRef.current;

    /*
         * Todavía no hay audio:
         * comenzamos a generar.
         */
    if (!audio || !audio.src) {
      await speak();
      return;
    }

    /*
         * Actualmente reproduciendo:
         * PAUSE.
         */
    if (!audio.paused) {
      isPausedRef.current = true;

      audio.pause();

      setIsPlaying(false);

      return;
    }

    /*
         * Actualmente pausado:
         * RESUME.
         */
    isPausedRef.current = false;

    try {
      await audio.play();

      isPlayingRef.current = true;

      setIsPlaying(true);
    } catch (err) {
      console.error(
        'Resume error:',
        err,
      );
    }
  };

  /*
     * ==========================================
     * VELOCIDAD
     * ==========================================
     */

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);

    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  /*
     * ==========================================
     * STOP
     * ==========================================
     */

  const stop = () => {
    /*
         * Invalidamos cualquier generación
         * que todavía esté trabajando.
         */
    generationIdRef.current++;

    isGeneratingRef.current = false;
    isPlayingRef.current = false;
    isPausedRef.current = false;

    /*
         * Detenemos audio.
         */
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;

      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }

      audio.src = '';
    }

    /*
         * Liberamos todos los chunks pendientes.
         */
    for (const url of queueRef.current) {
      URL.revokeObjectURL(url);
    }

    queueRef.current = [];

    setIsPlaying(false);
    setIsGenerating(false);
  };

  /*
     * ==========================================
     * ICONOS
     * ==========================================
     */

  const IconPlay = () => (
    <svg
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 5v14l11-7z"
      />
    </svg>
  );

  const IconPause = () => (
    <svg
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 5v14M16 5v14"
      />
    </svg>
  );

  /*
     * ==========================================
     * UI
     * ==========================================
     */

  return (
    <div className={styles.container}>

      {/* Selector de voz */}

      <select
        className={styles.select}
        value={selectedVoiceId || ''}
        onChange={(e) =>
          setSelectedVoiceId(
            e.target.value,
          )
        }
      >
        <option
          value=""
          disabled
        >
                    Select voice
        </option>

        {voices.map((voice) => (
          <option
            key={voice.id}
            value={voice.id}
          >
            {voice.name}
          </option>
        ))}
      </select>

      {/* Estado de Piper */}

      {selectedVoiceId &&
                !ready &&
                !error && (
        <span
          className={
            styles.statusText
          }
        >
                        Loading...
        </span>
      )}

      {error && (
        <span
          className={
            styles.errorText
          }
        >
                    Error loading
        </span>
      )}

      {/* Estado de generación */}

      {isGenerating && (
        <span
          className={
            styles.statusText
          }
        >
                    Generating...
        </span>
      )}

      {/* Play / Pause */}

      <Button
        variant="ghost"
        onClick={togglePlay}
        disabled={
          !ready ||
                    !selectedVoiceId
        }
      >
        {isPlaying ? (
          <IconPause />
        ) : (
          <IconPlay />
        )}
      </Button>

      {/* Stop */}

      <Button
        variant="ghost"
        onClick={stop}
        disabled={
          !isPlaying &&
                    !isGenerating &&
                    queueRef.current.length === 0
        }
      >
        <svg
          width={16}
          height={16}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
          />
        </svg>
      </Button>

      {/* Velocidad */}

      <select
        className={styles.select}
        value={playbackRate}
        onChange={(e) =>
          changeSpeed(
            Number(e.target.value),
          )
        }
      >
        <option value={0.5}>
                    0.5x
        </option>

        <option value={0.75}>
                    0.75x
        </option>

        <option value={1}>
                    1x
        </option>

        <option value={1.25}>
                    1.25x
        </option>

        <option value={1.5}>
                    1.5x
        </option>

        <option value={2}>
                    2x
        </option>
      </select>
    </div>
  );
}
