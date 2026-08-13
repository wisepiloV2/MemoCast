import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorPage, HomePage, EditorPage, DocumentPage, About, Privacy, SettingsPage, CategoriesPage, DocumentsPage } from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />, 
    errorElement: 
      <ErrorPage 
        title='Error 404. Page not found' 
        subtitle='The page you are looking for does not exist.'
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
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'documents/:category',
        element: <DocumentsPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
