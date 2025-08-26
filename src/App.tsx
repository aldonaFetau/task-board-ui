import { RouterProvider } from 'react-router-dom';
import { router } from '../src/app/routes';
import { AuthProvider } from '../src/context/auth/authContext';
import { BoardProvider } from '../src/context/board/boardContext';

export default function App() {
  return (
    <AuthProvider>
      <BoardProvider>
        <RouterProvider router={router} />
      </BoardProvider>
    </AuthProvider>
  );
}
