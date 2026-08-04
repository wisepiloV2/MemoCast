import { MainEditor } from "../feature/editor";
import { MainLayout } from '../component/layout/MainLayout'; 
import { BackButton } from "../component/BackButton/BackButton";

export function EditorPage(){
    return (
        <MainLayout>
            <BackButton />
            <MainEditor />
        </MainLayout>
    );
}