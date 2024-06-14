import { Outlet } from "react-router-dom";
import { createContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Shared/Navbar";

const MessageContext = createContext();

const Root = () => {
    const notifySuccess = (message) => {
        toast.success(message, {
            style: {
                border: "1px solid #10B981",
                padding: "16px",
                color: "#10B981",
            },
            iconTheme: {
                primary: "#10B981",
                secondary: "#FFFAEE",
            },
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            style: {
                border: "1px solid #EF4444 ",
                padding: "16px",
                color: "#EF4444 ",
            },
            iconTheme: {
                primary: "#EF4444 ",
                secondary: "#FFFAEE",
            },
        });
    };

    const messageInfo = {
        notifySuccess,
        notifyError,
    };

    return (
        <>
            <MessageContext.Provider value={messageInfo}>
                <Navbar />
                <main className="font-poppins transition duration-300">
                    <Outlet />
                </main>
            </MessageContext.Provider>
            {/* scroll up button */}

            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export { MessageContext };

export default Root;
