import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import ErrorPage from "../Pages/ErrorPage";
import Stats from "../Pages/Stats";
import Home from "../Pages/Home";
import Login from "../Pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/stats/:alias",
        element: <Stats></Stats>,

      },
    ]
  },
  {
    path: '*',
    element: <ErrorPage></ErrorPage>,
  }
])