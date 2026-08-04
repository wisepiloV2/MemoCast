import { useNavigate } from "react-router-dom";
import './BackButton.css'; 

interface BackButtonProps {
    label?: string;      
    className?: string; 
}

export function BackButton({ label = "Volver", className = "btn-go-back" }: BackButtonProps) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button 
            className={className} 
            onClick={handleGoBack}
            aria-label="Ir a la página anterior"
        >
            ← {label}
        </button>
    );
}