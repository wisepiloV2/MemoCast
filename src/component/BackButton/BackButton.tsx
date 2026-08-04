import { useNavigate } from "react-router-dom";
import './BackButton.css'; 

interface BackButtonProps {
    label?: string;      
    className?: string; 
}

export function BackButton({ label = "Volver", className = "" }: BackButtonProps) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button 
            className={`btn-go-back ${className}`.trim()} 
            onClick={handleGoBack}
        >
            ← {label}
        </button>
    );
}