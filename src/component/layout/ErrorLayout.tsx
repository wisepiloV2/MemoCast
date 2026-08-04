import { Link } from 'react-router-dom';
import './ErrorLayout.css'

interface ErrorLayoutProps {
  title: string;
  subtitle: string;
}

export function ErrorLayout({ title, subtitle }: ErrorLayoutProps) {
  return (
    <div className="error-container">
        <h1 className="error-title">{title}</h1>
        <p className="error-subtitle">{subtitle}</p>
        <Link to='/' className='error-link'>Go home</Link>
    </div>
  );
}