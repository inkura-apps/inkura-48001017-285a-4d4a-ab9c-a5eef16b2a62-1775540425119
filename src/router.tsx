import { createBrowserRouter } from 'react-router-dom'
import { MarketingLayout, AuthLayout, AppLayout } from './layouts'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'

export const router = createBrowserRouter([
  {
    element: (<MarketingLayout />),
    children: [
    {
      path: '/',
      element: <HomePage />,
    }
    ],
  },
  {
    element: (<AuthLayout />),
    children: [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignUpPage />,
    }
    ],
  },
  {
    element: (<ProtectedRoute><AppLayout /></ProtectedRoute>),
    children: [
    {
      path: '/dashboard',
      element: <DashboardPage />,
    },
    {
      path: '/projects',
      element: <ProjectsPage />,
    }
    ],
  }
])
