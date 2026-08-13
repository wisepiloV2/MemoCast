import { useState } from 'react';
import { Button } from '../../component/Button/Button';
import styles from './SettingsPage.module.css';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../component/layout/MainLayout';
import { VoiceManager } from '../../feature/piperTts';

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

const IconVoiceManager = () => (
  <svg
    className={styles.icon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3z"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 10v1a6 6 0 0012 0v-1"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 17v4m-3 0h6"
    />

    <path
      strokeLinecap="round"
      strokeWidth={2}
      d="M19 7.5a8 8 0 010 5M21 5a11 11 0 010 10"
    />
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
              <IconVoiceManager /> Voice manager
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
