import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import LoginPage from '../pages/loginPage/LoginPage';
import BoardPage from '../pages/boardPage/BoardPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <BoardPage /> },
      { path: '/lists/:id', element: <BoardPage /> }, 
    ],
  },
]);
