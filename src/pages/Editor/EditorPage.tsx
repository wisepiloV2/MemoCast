import { MainLayout } from "../../component/layout/MainLayout";
import { MainEditor } from "../../feature/editor";
import { Button } from "../../component/Button/Button";
import './EditorPage.css'; 
import { useNavigate } from "react-router-dom";

export function EditorPage() {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <header className='editor-page-header'>
                <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
            </header>
            
            <section className="editor-page-content">
                <MainEditor />
            </section>
        </MainLayout>
    );
}