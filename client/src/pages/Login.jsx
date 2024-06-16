import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { MessageContext } from "./Root";
import PasswordInput from "../components/FunctionalComponents/PasswordInput";
import Loader from "../components/FunctionalComponents/Loader";
import { FcGoogle } from "react-icons/fc";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Login = () => {
    const { user, login, googleLogin, loading, setUserInfo } =
        useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();

    const [password, setPassword] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (loading) {
        return <Loader />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const passwordValue = password;

        try {
            login(email, passwordValue).then(() => {
                axiosSecure
                    .get("/users/email/?email=" + email)
                    .then((response) => {

                        setUserInfo(response.data);
                    })
                    .catch(() => {
                        notifyError(
                            "An error occurred. Please try again later."
                        );
                    });
            });
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                notifyError("User not found");
                return;
            } else if (error.code === "auth/wrong-password") {
                notifyError("Wrong password");
                return;
            } else {
                notifyError("Invalid email or password");
                return;
            }
        }

        if (!loading) {
            notifySuccess("Logged in successfully");
            navigate(location?.state ? location.state : "/");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await googleLogin().then(() => {
                if (!loading) {
                    notifySuccess("Logged in successfully");
                    navigate(location?.state ? location.state : "/");
                }
            });
        } catch (error) {
            notifyError("An error occurred. Please try again later.");
        }
    };

    return (
        <section className="w-full flex items-center justify-center mt-20">
            <div className="bg-white animate__animated animate__fadeIn xl:mx-auto xl:w-full custom-shadow p-4 xl:max-w-sm 2xl:max-w-md rounded-lg border-8 border-black mx-3 mt-8">
                <h2 className="text-center text-2xl font-bold leading-tight text-black">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-900">
                    Enter your username and password to Login
                </p>
                <p className="mt-2 text-center text-sm text-gray-900">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary font-extrabold"
                    >
                        Register with email
                    </Link>
                </p>
                <form className="mt-2" onSubmit={(e) => handleLogin(e)}>
                    <div className="space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <PasswordInput
                                    name="password"
                                    placeholder="Password"
                                    onValueChange={(value) =>
                                        setPassword(value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-accent"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
                <div className="flex items-center text-center text-sm text-gray-900 w-full my-3">
                    <hr className="flex-grow my-4 border-gray-300" />
                    <span className="mx-2">Or continue with</span>
                    <hr className="flex-grow my-4 border-gray-300" />
                </div>
                <button
                    className="relative inline-flex w-full items-center justify-center rounded-md border border-secondary bg-primary px-3.5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-accent focus:bg-gray-100focus:outline-none"
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    <span className="mr-2 inline-block">
                        <FcGoogle className="h-6 w-6" />
                    </span>
                    Sign in with Google
                </button>
            </div>
        </section>
    );
};

export default Login;
