import { MainLayout } from '../component/layout/MainLayout'; 
import { Home } from '../feature/home';

export function HomePage(){
    return (
        <MainLayout> 
            <Home />
        </MainLayout>
    );
}