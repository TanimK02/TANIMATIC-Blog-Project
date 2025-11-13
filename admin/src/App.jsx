import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import LoginSign from './loginSignUp/LoginSign.jsx'
import Admin from './adminDashboard/Admin/Admin.jsx'
import Access from './adminAccess/Access.jsx'
import CreatePost from './createPost/CreatePost.jsx'
import { AuthProvider } from './provider/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginSign />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      )
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      )
    },
    {
      path: '/access',
      element: <Access />
    },
    {
      path: '/create-post',
      element: (
        <ProtectedRoute requireAdmin={true}>
          <CreatePost />
        </ProtectedRoute>
      )
    }
  ]);
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
