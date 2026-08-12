import styles from './Privacy.module.css';
import { MainLayout } from '../../component/layout/MainLayout';
import { Button } from '../../component/Button/Button';
import { useNavigate } from 'react-router-dom';

export function Privacy() {
  const navigate = useNavigate(); 
  return (
    <MainLayout>
      <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
      <article className={styles.container}>
                
        <h1 className={styles.title}>Privacy and Security</h1>
                
        <p className={styles.intro}>
                    At MemoCast, your privacy isn't a "configurable option", it's the technical foundation 
                    upon which the entire project is built. We designed the application so that you have 
                    absolute control over your information, right from the first note.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>100% Local (Local-First)</h2>
          <p className={styles.paragraph}>
                        The vast majority of modern productivity applications act as middlemen: 
                        you write, they save your text on their servers, and then they show it to you. 
          </p>
          <p className={styles.paragraph}>
                        MemoCast eliminates that middleman by using a browser technology 
                        called <span className={styles.highlight}>IndexedDB</span>. 
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
                            Your documents and categories <span className={styles.highlight}>never leave your device</span>.
            </li>
            <li className={styles.listItem}>
                            There is no centralized server where your notes or future audios are sent.
            </li>
            <li className={styles.listItem}>
                            You can use the application even without an internet connection, because everything happens in your browser.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What data do we collect?</h2>
          <p className={styles.paragraph}>
                        The short answer is: <span className={styles.highlight}>None.</span>
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.highlight}>No accounts:</span> You don't need an email, a password, or to register to use MemoCast.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>No trackers:</span> We don't use tracking cookies, hidden pixels, or invasive analytics tools that sell your behavior to third parties.
            </li>
            <li className={styles.listItem}>
              <span className={styles.highlight}>Zero access:</span> As developers of the project, we have absolutely no technical or physical way to see, read, or modify what you write.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Verifiable Transparency</h2>
          <p className={styles.paragraph}>
                        It's easy to promise privacy, but we believe that trust is proven with facts. 
                        MemoCast is an <span className={styles.highlight}>Open Source</span> project.
          </p>
          <p className={styles.paragraph}>
                        The complete source code of the application is publicly available on GitHub. 
                        Any developer, security expert, or curious user can read the code, 
                        audit it, and verify for themselves that our claims about local storage are 100% true.
          </p>
        </section>

        <div className={styles.alertBox}>
          <h3 className={styles.alertTitle}>Shared Security: Your Responsibility</h3>
          <p className={styles.paragraph} style={{ marginBottom: 0 }}>
                        Since MemoCast does not save anything in the cloud and everything physically resides in your browser's memory, 
            <span className={styles.highlight}> the security of your data depends 
                        on the security of your device</span>. We recommend keeping your computer protected 
                        with a password, locking your screen when you are not around, and backing up 
                        your device so you don't lose your notes if your hard drive fails.
          </p>
        </div>
      </article>
    </MainLayout>
  );
}
