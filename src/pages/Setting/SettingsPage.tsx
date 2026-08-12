import { useState } from 'react';
import { VoiceManager } from '../../feature/piper';
import { Button } from '../../component/Button/Button';
import styles from './SettingsPage.module.css';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../component/layout/MainLayout';

type SettingsTab = 'voice manager';

const IconBack = () => (
  <svg 
    width={24} 
    height={24} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M10 19l-7-7m0 0l7-7m-7 7h18" 
    />
  </svg>
);

const IconVoiceDownload = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6m0 0l-3-3m3 3l3-3" />
  </svg>
);

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('voice manager');
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.settingsContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Button variant='ghost' onClick={() => navigate('/')}> 
              <IconBack />
            </Button>
            <h1 className={styles.sidebarTitle}>Settings</h1>
          </div>

          <nav className={styles.navMenu}>
            <Button
              onClick={() => setActiveTab('voice manager')}
              className={`${styles.navButton} ${activeTab === 'voice manager' ? styles.active : ''}`}
            >
              <IconVoiceDownload /> Voice manager
            </Button>
          </nav>
        </aside>

        <div className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {activeTab === 'voice manager' && <VoiceManager />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
