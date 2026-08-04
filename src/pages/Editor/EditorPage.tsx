import { MainLayout } from "../../component/layout/MainLayout";
import { MainEditor } from "../../feature/editor";
import { BackButton } from "../../component/BackButton/BackButton";
import './EditorPage.css'; 

export function EditorPage() {
    return (
        <MainLayout>
            <header className='editor-page-header'>
                <BackButton />
            </header>
            
            <section className="editor-page-content">
                <MainEditor />
            </section>
        </MainLayout>
    );
}