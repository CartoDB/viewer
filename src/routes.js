import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from './components/views/Home';
import NotFound from './components/views/NotFound';

// Auto import
const routes = [
  {
    path: '/user/:username/:type',
    element: <Home />,
    children: [
      // Auto import routes
    ],
  },
  { path: '404', element: <NotFound /> },
  { path: '*', element: <Navigate to='/404' /> },
];

export default routes;
