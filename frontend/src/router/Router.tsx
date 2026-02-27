import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Schedule from '../pages/SchedulePage';
import Apply from '../pages/Apply';
import Edit from '../pages/Edit';
import Password from '../pages/Password';
import type { JSX } from 'react';




const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  { path: '/', element: <Login />},
  { path: '/home', element: <AuthGuard><Home /></AuthGuard> },
  { path: '/schedule', element: <AuthGuard><Schedule /></AuthGuard> },
  { path: '/apply', element: <AuthGuard><Apply /></AuthGuard> },
  { path: '/edit', element: <AuthGuard><Edit /></AuthGuard> },
  { path: '/password', element: <AuthGuard><Password /></AuthGuard> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
