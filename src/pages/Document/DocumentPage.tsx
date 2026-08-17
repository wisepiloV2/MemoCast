import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from '../../component/layout/MainLayout';
import { useDocumentById, DocumentContent } from '../../feature/document';
import { Button } from '../../component/Button/Button';
import { Modal } from '../../component/Modal/Modal';
import { useVoiceMutations, VoiceSelect } from '../../feature/audio';
import { AudioPlayer } from '../../feature/audio/components/AudioPlayer';
import styles from './DocumentPage.module.css';

export function DocumentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const documentId = id ? Number(id) : undefined;

  const { document, isLoading } = useDocumentById(documentId);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const { installedVoices } = useVoiceMutations();

  const activeVoice = selectedVoice || (installedVoices.length > 0 ? installedVoices[0].id : '');

  const voiceOptions = installedVoices.map((voice) => ({
    value: voice.id,
    label: voice.name,
  }));

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <p>Loading document...</p>
        </div>
      );
    }

    if (!document || documentId === undefined) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Document not found</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.documentPage}>
        <header className={styles.header}>
          <div className={styles.headerActions}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => navigate(`/editor/${id}`)}>
              Edit Document
            </Button>
          </div>

          <VoiceSelect
            options={voiceOptions}
            value={activeVoice}
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

        {activeVoice && (
          <AudioPlayer
            documentId={documentId}
            htmlContent={document.htmlText}
            voiceId={activeVoice}
          />
        )}

        <Button
          type="button"
          className={styles.notesButton}
          onClick={() => setIsNotesOpen(true)}
        >
          Notes
        </Button>

        <Modal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)}>
          <div className={styles.notesContent}>
            <h2>Notes</h2>

            {document.htmlNote ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: document.htmlNote,
                }}
              />
            ) : (
              <p>No notes available.</p>
            )}
          </div>
        </Modal>
      </div>
    );
  };

  return <MainLayout>{renderContent()}</MainLayout>;
}