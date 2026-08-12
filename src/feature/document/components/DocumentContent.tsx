import styles from './DocumentContent.module.css';

interface DocumentContentProps {
    title: string;
    category: string;
    htmlText: string;
}

export function DocumentContent({ title, category, htmlText }: DocumentContentProps) {
  return (
    <div className={styles.documentContainer}>
      <h1 className={styles.title}>{title}</h1>
      <h4 className={styles.category}>{category}</h4>
      <div 
        className={styles.content}
        //Usaremos un sanetizador cuando agregue un compartir
        dangerouslySetInnerHTML={{ __html: htmlText }}
      />
    </div>
  );
}
