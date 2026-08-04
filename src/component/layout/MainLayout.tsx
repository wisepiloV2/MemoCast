import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout-container">
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  );
}