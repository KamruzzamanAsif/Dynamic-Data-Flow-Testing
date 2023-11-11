import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import WelcomePage from './pages/Welcome.tsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
