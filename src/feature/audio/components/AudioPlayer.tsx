import { useAudioPlayer } from "../hooks/useAudioPlayer";
import styles from "./AudioPlayer.module.css";
import { Button } from "../../../component/Button/Button";

interface AudioPlayerProps {
  documentId: number;
  htmlContent: string;
  voiceId: string;
}

const RewindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 13a10 10 0 1 0 10-10H3" />
    <polyline points="7 7 3 3 7-1" />
  </svg>
);

const ForwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 13a10 10 0 1 1-10-10H21" />
    <polyline points="17 7 21 3 17-1" />
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

export const StopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" />
  </svg>
);

const ReloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <polyline points="21 3 21 8 16 8" />
  </svg>
);

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) { return "0:00" }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ documentId, htmlContent, voiceId }: AudioPlayerProps) {
  const {
    audioDocument,
    isPlaying,
    currentTime,
    duration,
    progress,
    isGenerating,
    hasError,
    generateAudio,
    togglePlay,
    seek,
    stop,
    handleRegenerate
  } = useAudioPlayer({ documentId, htmlContent, voiceId });

  if (!audioDocument || isGenerating) {
    return (
      <div className={styles.player}>
        <Button onClick={generateAudio} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate audio"}
        </Button>

        {isGenerating && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${progress}%`}}
              />
            </div>
            <span className={styles.progressText}>{progress}%</span>
          </div>
        )}

        {hasError && (
          <span className={styles.error}>Error generating audio</span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.player}>
      <Button className={styles.control} onClick={() => seek(-10)} title="Rewind 10 seconds"><RewindIcon /></Button>

      <Button className={styles.playButton} onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>

      <Button className={styles.control} onClick={() => seek(10)} title="Fast forward 10 seconds">
        <ForwardIcon />
      </Button>

      <Button className={styles.control} onClick={stop} title="End">
        <StopIcon />
      </Button>

      <span className={styles.time}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <Button className={styles.regenerateButton} onClick={handleRegenerate} disabled={isGenerating} title="Regenerate audio"><ReloadIcon /></Button>
    </div>
  );
}