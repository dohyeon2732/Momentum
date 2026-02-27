import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Schedule from '../pages/SchedulePage';
import Apply from '../pages/Apply';
import Edit from '../pages/Edit';
import Password from '../pages/Password';
// import type { JSX } from 'react';


// const requireAuth = (element: JSX.Element) => {
//   const token = localStorage.getItem('accessToken');
//   return token?element:<Navigate to="/" replace />;
// }

const router = createBrowserRouter([
  { path: '/', element: <Login />},
  { path: '/home', element: (<Home />) },
  { path: '/schedule', element: (<Schedule />) },
  { path: '/apply', element: (<Apply />) },
  { path: '/edit', element: (<Edit />) },
  { path: '/password', element: (<Password />) },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
