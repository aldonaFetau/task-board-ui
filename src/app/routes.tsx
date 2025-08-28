
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import LoginPage from '../pages/loginPage/LoginPage';
import BoardPage from '../pages/boardPage/BoardPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> }, // default page is Login
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/board', element: <BoardPage /> },       
      //{ path: '/lists/:id', element: <ListDetails /> }
    ],
  },
]);
