import { createBrowserRouter } from 'react-router-dom';
import Main from './pages/main';
import Login from './pages/login';
import Test from './pages/test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]);

export default router;
