export interface AudioController {
  audio: HTMLAudioElement;
  togglePlay: () => Promise<void>;
  seek: (seconds: number) => void;
  stop: () => void;
  destroy: () => void;
}

export function createAudioController( blob: Blob, onTimeUpdate: (currentTime: number) => void, onDurationChange: (duration: number) => void, onPlay: () => void, onPause: () => void, onEnded: () => void ): AudioController {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  const handleTimeUpdate = () => {
    onTimeUpdate(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    onDurationChange(audio.duration);
  };

  const handlePlay = () => {
    onPlay();
  };

  const handlePause = () => {
    onPause();
  };

  const handleEnded = () => {
    onEnded();
  };

  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('loadedmetadata', handleLoadedMetadata);
  audio.addEventListener('play', handlePlay);
  audio.addEventListener('pause', handlePause);
  audio.addEventListener('ended', handleEnded);

  const togglePlay = async () => {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (seconds: number) => {
    if (!Number.isFinite(audio.duration)) { return }
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration));
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  const destroy = () => {
    audio.pause();
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.removeEventListener('play', handlePlay);
    audio.removeEventListener('pause', handlePause);
    audio.removeEventListener('ended', handleEnded);

    URL.revokeObjectURL(url);
  };

  return {
    audio,
    togglePlay,
    seek,
    stop,
    destroy,
  };
}