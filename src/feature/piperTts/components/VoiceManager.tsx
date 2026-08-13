import { Button } from '../../../component/Button/Button';
import styles from './VoiceManager.module.css';
import { useTtsMutations } from '../hooks/useTtsMutations';

export const VoiceManager = () => {
  const { 
    isProcessing,
    availableVoices, 
    downloadById,
    deleteById,
    deleteAll, 
  } = useTtsMutations();

  const installedVoices = availableVoices.filter(voice => voice.isInstalled);
  const notInstalledVoices = availableVoices.filter(voice => !voice.isInstalled);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Voice Manager (Piper)</h2>
        
        {installedVoices.length > 0 && (
          <Button 
            onClick={() => deleteAll()} 
            disabled={isProcessing} 
            variant="danger"
          >
            Delete All
          </Button>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Installed</h3>
        {installedVoices.length === 0 ? (
          <p className={styles.emptyState}>No voices installed</p>
        ) : (
          <ul className={styles.list}>
            {installedVoices.map((voice) => (
              <li key={voice.id} className={styles.listItem}>
                <span className={styles.voiceName}>
                  {voice.name} 
                </span>
                <div className={styles.actions}>
                  <Button 
                    onClick={() => deleteById(voice.id)}
                    disabled={isProcessing}
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
        {notInstalledVoices.length === 0 ? (
          <p className={styles.emptyState}>All available voices have been downloaded.</p>
        ) : (
          <ul className={styles.list}>
            {notInstalledVoices.map((voice) => (
              <li key={voice.id} className={styles.listItem}>
                <span className={styles.voiceName}>
                  {voice.name}
                </span>
                <div className={styles.actions}>
                  <Button 
                    onClick={() => downloadById(voice.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Download'}
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
