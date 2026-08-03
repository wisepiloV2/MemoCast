import { ViewUserText } from "../feature/text";

export function TextView(){
    return (
        <main style={{display: 'flex', flexDirection:'column', width: '100vw', height: '100vh', backgroundColor: '#202124', justifyContent: 'center', alignItems: 'center'}}>
            <ViewUserText />
        </main>
    );
}