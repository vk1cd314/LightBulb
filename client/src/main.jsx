import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Login from "./pages/Login";
import Root from "./pages/Root";
import AuthProvider from "./Auth/AuthProvider";
import Register from "./pages/Register";
import ErrorPage from "./components/ErrorPage";
import PrivateRoute from "./Auth/PrivateRoute";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Communities from "./pages/Communities";
import CreateCommunity from './components/Communities/CreateCommunity';
import Blogs from "./pages/Blogs";
import ExploreCommunities from "./components/Communities/ExploreCommunities";
import MyCommunities from "./components/Communities/MyCommunities";
import CreatePost from "./components/Blogs/CreateBlog";
import CreateBlog from "./components/Blogs/CreateBlog";
import AllBlogsCards from "./components/Blogs/AllBlogsCards";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/blogs",
                element: <Blogs></Blogs>,
                children: [
                    {
                        path: "/blogs/explore",
                        element: <AllBlogsCards></AllBlogsCards>,
                    },
                    {
                        path: "/blogs/my-blogs",
                        element: <AllBlogsCards></AllBlogsCards>,
                    }
                ]
            },
            {
                path: "/create-blog",
                element: <CreateBlog></CreateBlog>,
            },
            {
                path: "/notifications",
                element: <div className="mt-20">Notifications</div>,
            },
            {
                path: "/communities",
                element: <Communities />,
                children: [
                    {
                        path: "/communities/explore",
                        element: <ExploreCommunities />,
                    },
                    {
                        path: "/communities/my-communities",
                        element: <MyCommunities/>,
                    },
                ],
            },
            {
                path: "/settings",
                element: (
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                ),
            },
            {
                path: "/profile",
                element: <PrivateRoute><Profile /></PrivateRoute>,
            },
            {
                path: "/create-community",
                element: <PrivateRoute><CreateCommunity /></PrivateRoute>,
            },
            {
                path: "/create-post",
                element: <PrivateRoute><CreatePost/></PrivateRoute>,
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);
