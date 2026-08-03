import './ErrorPage.css';

interface ErrorPageProps {
  title: string;
  subtitle: string;
}

export function ErrorPage({title, subtitle}: ErrorPageProps) {
  return (
    <div className="error-container">

      <main className="error-main">
    
        <h1 className="error-title">{title}</h1>
        <p className="error-subtitle">{subtitle}</p>


        {/*<Link to='/' className='error-link'>Ir al Inicio</Link> */}

      </main>
    </div>
  );
}