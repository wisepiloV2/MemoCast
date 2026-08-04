import { MainLayout } from '../component/layout/MainLayout'; 
import { ErrorLayout } from '../component/layout/ErrorLayout';

interface ErrorPageProps {
  title: string;
  subtitle: string;
}

export function ErrorPage({ title, subtitle }: ErrorPageProps) {
  return (
    <MainLayout>
      <ErrorLayout 
        title={title}
        subtitle={subtitle}
      />
    </MainLayout>
  );
}