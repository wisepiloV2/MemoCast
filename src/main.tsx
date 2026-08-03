import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MainEditor } from './feature/editor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainEditor />
  </StrictMode>,
)
