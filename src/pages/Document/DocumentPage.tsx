import { Document } from "../../feature/document";
import { MainLayout } from "../../component/layout/MainLayout";

export function DocumentPage(){
    return (
        <MainLayout> 
            <Document />
        </MainLayout>
    );
}