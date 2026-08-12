import styles from './About.module.css';
import { MainLayout } from '../../component/layout/MainLayout';
import { Button } from '../../component/Button/Button';
import { useNavigate } from 'react-router-dom';

export function About() {
  const navigate = useNavigate(); 
  return (
    <MainLayout>
      <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
      <article className={styles.container}>
        <h1 className={styles.title}>About MemoCast</h1>
                
        <p className={styles.intro}>
                    MemoCast is a web-based study organizer designed to be fast, free, and 
                    absolutely private. It was born from the need for a tool with no storage 
                    limits or paywalls, adapted to a study workflow based on reading, 
                    listening, and summarizing.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The meaning of MemoCast</h2>
          <p className={styles.paragraph}>
                        The project's name defines its future vision:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Memo:</span> Represents notes, 
                            reading, and the structured organization of texts.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Cast:</span> Refers to audio, 
                            recognizing that listening is one of the most effective ways to retain information.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Total privacy by design (Local-First)</h2>
          <p className={styles.paragraph}>
                        Most note-taking applications store your information in the cloud. 
                        MemoCast works differently.
          </p>
          <p className={styles.paragraph}>
                        The entire application is built on <span className={styles.highlight}>IndexedDB</span> technology. 
                        This means that all the documents, categories, and texts you enter are saved 
                        solely locally on your browser and device.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>There are no external servers analyzing your notes.</li>
            <li className={styles.listItem}>There are no cloud databases.</li>
            <li className={styles.listItem}>No one, not even the project developers, has access to what you write.</li>
            <li className={styles.listItem}>Your storage limit is simply the capacity of your own device.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The future of the project (Roadmap)</h2>
          <p className={styles.paragraph}>
                        Currently, MemoCast is in its first phase (MVP), allowing the creation 
                        of texts and their organization through categories. However, the project is 
                        constantly evolving.
          </p>
          <p className={styles.paragraph}>
                        Upcoming updates are focused on turning MemoCast into a comprehensive 
                        study platform, incorporating:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Integration and playback of audio notes.</li>
            <li className={styles.listItem}>Support for multimedia elements (images and videos).</li>
            <li className={styles.listItem}>Inclusion of charts and diagrams to complement notes.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Source and Transparency</h2>
          <p className={styles.paragraph}>
                        MemoCast is an Open Source project. We believe in technical transparency 
                        and collaborative development. Any user with technical knowledge can 
                        visit our GitHub repository to:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Audit the code and verify that privacy policies are strictly followed.</li>
            <li className={styles.listItem}>Review the software architecture.</li>
            <li className={styles.listItem}>Report bugs or propose new features.</li>
          </ul>
        </section>
      </article>
    </MainLayout>
  );
}
