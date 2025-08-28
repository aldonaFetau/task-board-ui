import { RouterProvider } from 'react-router-dom';
import { router } from '../src/app/routes';
import { AuthProvider } from '../src/context/auth/authContext';
import { BoardProvider } from '../src/context/board/boardContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BoardProvider>
          <RouterProvider router={router} />
        </BoardProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
