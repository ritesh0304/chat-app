import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Bills from './pages/Bills';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat/>,
  },
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'setAvatar',
    element: <SetAvatar />
  },
  {
    path: '/bills',
    element: <Bills />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
