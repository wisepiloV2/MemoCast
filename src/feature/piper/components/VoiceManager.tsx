import { useVoiceManager } from '../hooks/useVoiceManager';
import { Button } from '../../../component/Button/Button';
import styles from './VoiceManager.module.css';

export const VoiceManager = () => {
  const { 
    installedVoices, 
    availableVoices, 
    handleInstall, 
    handleDelete, 
    isDownloading, 
  } = useVoiceManager();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Voice Manager (Piper)</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Installed</h3>
        {installedVoices.length === 0 ? (
          <p className={styles.emptyState}>No voices installed</p>
        ) : (
          <ul className={styles.list}>
            {installedVoices.map((voice) => (
              <li key={voice.id} className={styles.listItem}>
                <span className={styles.voiceName}>{voice.name}</span>
                <div className={styles.actions}>
                  <Button 
                    onClick={() => handleDelete(voice.id)}
                    disabled={isDownloading}
                    variant="danger"
                  >
                                        Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Available for download</h3>
        {availableVoices.length === 0 ? (
          <p className={styles.emptyState}>All available voices have been downloaded.</p>
        ) : (
          <ul className={styles.list}>
            {availableVoices.map(([id, voiceConfig]) => (
              <li key={id} className={styles.listItem}>
                <span className={styles.voiceName}>{voiceConfig.name}</span>
                <div className={styles.actions}>
                  <Button 
                    onClick={() => handleInstall(id)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
