import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorPage, HomePage, EditorPage, DocumentPage, About, Privacy, SettingsPage } from '../pages';
import { Testing } from '../testing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />, 
    errorElement: 
      <ErrorPage 
        title='Error 404. Pagina no encontrada' 
        subtitle='La pagina que buscas no existe.'
      />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { 
        path: 'editor', 
        element: <EditorPage />, 
      }, 
      { 
        path: 'editor/:id', 
        element: <EditorPage />, 
      }, 
      {
        path: 'document/:id',
        element: <DocumentPage />,
      },
      {
        path: 'about',
        element: <About />,
      },
      { path: 'privacy',
        element: <Privacy />,
      },
      { path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'test',
        element: <Testing />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
