import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import LoginSign from './loginSignUp/LoginSign.jsx'
import Admin from './adminDashboard/Admin/Admin.jsx'
import Access from './adminAccess/Access.jsx'
import CreatePost from './createPost/CreatePost.jsx'
import { AuthProvider } from './provider/AuthProvider.jsx'
function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginSign />
    },
    {
      path: '/',
      element: <Admin />
    },
    {
      path: '/admin',
      element: <Admin />
    },
    {
      path: '/access',
      element: <Access />
    },
    {
      path: '/create-post',
      element: <CreatePost />
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
