import { MainEditor } from "../feature/editor";

export function EditorPage(){
    return (
        <main style={{display: 'flex', flexDirection:'column', width: '100vw', height: '100vh', backgroundColor: '#202124', justifyContent: 'center', alignItems: 'center'}}>
            <MainEditor />
        </main>
    );
}