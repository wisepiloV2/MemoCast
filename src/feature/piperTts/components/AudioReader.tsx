import { Button } from '../../../component/Button/Button';
import { useTtsSynthesizer } from '../hooks/useTtsSynthesizer';
import { useTtsPlayer } from '../hooks/useTtsPlayer';
import { htmlToAudioChunks } from '../utils/htmlToAudioText';
import styles from './AudioReader.module.css';

const IconPlay = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconPause = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const IconPrevious = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const IconNext = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

interface AudioReaderProps {
  htmlContent: string;
  voiceId: string;
}

export function AudioReader({ htmlContent, voiceId } : AudioReaderProps) {
  const { generateAudioChunk } = useTtsSynthesizer();
  
  const { 
    loadAndPlay, 
    togglePlayPause, 
    playNext, 
    playPrevious, 
    isPlaying, 
    isWaiting,  
    totalChunks 
  } = useTtsPlayer(generateAudioChunk);

  const handleStartReading = () => {
    const chunks = htmlToAudioChunks(htmlContent);
    loadAndPlay(chunks, voiceId);
  };

  return (
    <div className={styles.floatingContainer}>
      {totalChunks === 0 ? (
        <Button onClick={handleStartReading}>
            <IconPlay /> Play Audio
        </Button>
      ) : (
        <div className={styles.playerContainer}>
          <div className={styles.controls}>
            
            <Button onClick={playPrevious} variant="secondary" title="Previous">
              <IconPrevious />
            </Button>
            
            <Button onClick={togglePlayPause} disabled={isWaiting}>
              <div className={styles.playPauseContent}>
                {isWaiting ? (
                  <span className={styles.loadingText}>Loading...</span>
                ) : isPlaying ? (
                  <IconPause />
                ) : (
                  <IconPlay />
                )}
              </div>
            </Button>
            
            <Button onClick={playNext} variant="secondary" title="Next">
              <IconNext />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};