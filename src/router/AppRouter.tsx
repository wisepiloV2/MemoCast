import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorPage, HomePage, EditorPage, DocumentPage, About, Privacy } from '../pages';

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
      },
      {
        path: 'about',
        element: <About />
      },
      { path: 'privacy',
        element: <Privacy />
      }
    ],
  }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};