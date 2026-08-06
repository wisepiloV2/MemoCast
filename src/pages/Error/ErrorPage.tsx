import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css';
import { MainLayout } from '../../component/layout/MainLayout';

interface ErrorPageProps {
  title: string;
  subtitle: string;
}

export function ErrorPage({ title, subtitle }: ErrorPageProps) {
  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        
        <Link to="/" className={styles.btnHome}>
          Go home
        </Link>
      </div>
    </MainLayout>
  );
}