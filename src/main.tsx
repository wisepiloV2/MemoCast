import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './router/AppRouter';
import { TaskProvider } from './feature/task';
import { executeAudioTask } from './feature/audio';

createRoot(document.getElementById('root')!).render(
  <TaskProvider executeTask={executeAudioTask}>
    <StrictMode>
      <AppRouter />
    </StrictMode>
  </TaskProvider>
  ,
);
