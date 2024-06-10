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

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <div className="mt-20">Landing page</div>,
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
                path: "/blog",
                element: <div className="mt-20">Blog</div>,
            },
            {
                path: "/notifications",
                element: <div className="mt-20">Notifications</div>,
            },
            {
                path: "/communities",
                element: <div className="mt-20">Communities</div>,
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
                element: <Profile />,
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
