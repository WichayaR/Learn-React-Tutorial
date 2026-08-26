import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import Lesson from '../pages/Lesson.jsx';
import About from '../pages/About.jsx';
import NotFound from '../pages/NotFound.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'lesson/:slug', element: <Lesson /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);