import React from 'react';
import styles from'./MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}