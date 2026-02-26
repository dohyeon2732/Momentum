import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Schedule from '../pages/SchedulePage';
import Apply from '../pages/Apply';
import Edit from '../pages/Edit';
import Password from '../pages/Password';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/home', element: <Home /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/apply', element: <Apply /> },
  { path: '/edit', element: <Edit /> },
  { path: '/password', element: <Password /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
