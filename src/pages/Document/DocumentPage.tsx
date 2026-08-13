import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MainLayout } from '../../component/layout/MainLayout';
import { useDocumentById, DocumentContent } from '../../feature/document';
import { Button } from '../../component/Button/Button';
import { AudioReader, useTtsMutations, VoiceSelect } from '../../feature/piperTts';
import styles from './DocumentPage.module.css';

export function DocumentPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const documentId = id ? Number(id) : undefined;
  const { document, isLoading } = useDocumentById(documentId);

  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const { installedVoices } = useTtsMutations();

  const voiceOptions = installedVoices.map(voice => ({
    value: voice.id,
    label: voice.description
  }));

  useEffect(() => {
    if (!selectedVoice && installedVoices.length > 0) {
      setSelectedVoice(installedVoices[0].id);
    }
  }, [installedVoices, selectedVoice]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <p>Loading document...</p>
        </div>
      );
    }

    if (!document) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Document not found</h2>
          <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
        </div>
      );
    }

    return (
      <div className={styles.documentPage}>
        <header className={styles.header}>
          <div className={styles.headerActions}>
            <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
            <Button variant="primary" onClick={() => navigate(`/editor/${id}`)}>
              Edit Document
            </Button>
          </div>

          <VoiceSelect
            options={voiceOptions}
            value={selectedVoice}
            onChange={setSelectedVoice}
          />
        </header>
                
        <section className={styles.content}>
          <DocumentContent 
            title={document.title}
            category={document.category}
            htmlText={document.htmlText}
          />
        </section>

        {selectedVoice && (
          <AudioReader htmlContent={document.htmlText} voiceId={selectedVoice} />
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      {renderContent()}
    </MainLayout>
  );
}