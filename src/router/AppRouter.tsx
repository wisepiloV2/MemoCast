import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorPage } from '../pages/Error/ErrorPage';
import { EditorPage } from '../pages/Editor/EditorPage';
import { HomePage } from '../pages/HomePage';
import { DocumentPage } from '../pages/Document/DocumentPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />, 
    errorElement: 
      <ErrorPage 
        title='Error 404. Pagina no encontrada' 
        subtitle='La pagina que buscas no existe.'
      />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      { 
        path: 'editor', 
        element: <EditorPage /> 
      }, 
      { 
        path: 'editor/:id', 
        element: <EditorPage /> 
      }, 
      {
        path: 'document/:id',
        element: <DocumentPage />
      }
    ],
  }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};