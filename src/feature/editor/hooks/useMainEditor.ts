import { useState } from "react";

export function useMainEditor() {
    const [title, setTitle] = useState("");
    const [category, setcategory] = useState("");

    const categories = ["Desarrollo Web", "Diseño Gráfico", "Marketing", "Ventas", "Recursos Humanos"];

    const [htmlText, setHtmlText] = useState("Escribe tu contenido aquí...");

    //Luego cambiare esto -----
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        
        console.log("Datos listos para enviar al backend:", {
            title: title,
            categorySelected: category,
            htmlText: htmlText
        });

    };

    return {
        title,
        setTitle,
        category,
        setcategory,
        categories ,
        htmlText,
        setHtmlText,
        handleSubmit
    };
}