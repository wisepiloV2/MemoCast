import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ErrorPage } from '../pages/ErrorPage';
import { EditorPage } from '../pages/EditorPage';
import { TextView } from '../pages/TextView';
import { HomePage } from '../pages/HomePage';


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
        index:true,
        element: <HomePage />
      },
      { 
        path: 'editor', 
        element: <EditorPage /> 
      }, {
        path: 'text',
        element: <TextView />
      }
    ],
  }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};