import { useEffect, useRef, useState } from "react";
import { Button } from "../../../component/Button/Button";
import { usePiper } from "../hooks/usePiper";
import { useVoiceManager } from "../hooks/useVoiceManager";
import styles from "./VoiceReproducer.module.css";

interface VoiceReproducerProps {
    text: string;
}

export function VoiceReproducer({ text }: VoiceReproducerProps) {
    const {
        installedVoices: voices,
        selectedVoiceId,
        setSelectedVoiceId,
    } = useVoiceManager();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);

    const {
        ready,
        error,
        synthesize,
    } = usePiper(selectedVoiceId);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
            }
        };
    }, []);

    useEffect(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
    }, [selectedVoiceId]);

    function stripHtml(html: string): string {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    }

    const speak = async () => {
        if (!selectedVoiceId) {
            return;
        }

        if (audioRef.current) {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
                return;
            } catch (error) {
                console.error("Playback error:", error);
            }
        }

        const plainText = stripHtml(text);
        if (!plainText.trim()) return;

        try {
            setIsGenerating(true);
            const wav = await synthesize(plainText);
            const url = URL.createObjectURL(wav);
            audioUrlRef.current = url;

            const audio = new Audio(url);
            audio.playbackRate = playbackRate;
            audioRef.current = audio;

            audio.addEventListener("play", () => setIsPlaying(true));
            audio.addEventListener("pause", () => setIsPlaying(false));
            audio.addEventListener("ended", () => setIsPlaying(false));

            await audio.play();
        } catch (error) {
            console.error("Playback error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) {
            await speak();
            return;
        }

        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    };

    const changeSpeed = (rate: number) => {
        setPlaybackRate(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const stop = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
    };

    const IconPlay = () => (
        <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v14l11-7z" />
        </svg>
    );

    const IconPause = () => (
        <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5v14M16 5v14" />
        </svg>
    );

    return (
        <div className={styles.container}>
            
            {/* Selector de voz */}
            <select
                className={styles.select}
                value={selectedVoiceId || ""}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
            >
                <option value="" disabled>Select voice</option>
                {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                        {voice.name}
                    </option>
                ))}
            </select>

            {/* Estados de carga / error */}
            {selectedVoiceId && !ready && !error && (
                <span className={styles.statusText}>Loading...</span>
            )}
            {error && (
                <span className={styles.errorText}>Error loading</span>
            )}
            {isGenerating && (
                <span className={styles.statusText}>Generating...</span>
            )}

            {/* Play / Pause */}
            <Button
                variant="ghost"
                onClick={togglePlay}
                disabled={!ready || isGenerating || !selectedVoiceId}
            >
                {isPlaying ? <IconPause /> : <IconPlay />}
            </Button>

            {/* Stop */}
            <Button
                variant="ghost"
                onClick={stop}
                disabled={!audioRef.current}
            >
                <svg width={16} height={16} fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
            </Button>

            {/* Velocidad */}
            <select
                className={styles.select}
                value={playbackRate}
                onChange={(e) => changeSpeed(Number(e.target.value))}
            >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
            </select>
        </div>
    );
}