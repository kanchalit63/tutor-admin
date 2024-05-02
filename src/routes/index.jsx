import { createBrowserRouter } from "react-router-dom"
import AdminLogin from "../pages/adminlogin/AdminLogin"
import HomeAdmin from "../pages/Home/HomeAdmin"
import ProtectedRoute from "../components/protect/ProtectedRoute"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><HomeAdmin /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <HomeAdmin />,
      },
    ],
  },
  {
    path: "/login",
    element: <AdminLogin />,
  },
])

export default router
