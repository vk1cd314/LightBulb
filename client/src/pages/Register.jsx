import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";
import { MessageContext } from "./Root";
import PasswordInput from "../components/FunctionalComponents/PasswordInput";
import Loader from "../components/FunctionalComponents/Loader";
import { FcGoogle } from "react-icons/fc";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Register = () => {
    const {
        createUser,
        logout,
        user,
        updateUserProfile,
        loading,
        googleLogin,
        setLoading,
        setUserInfo,
    } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (loading) {
        return <Loader />;
    }

    /**
     * Handles the registration process.
     *
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the registration process is complete.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const username = formData.get("username");
        const passwordValue = password;
        const confirmationValue = confirmation;

        //password validation
        if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(passwordValue)) {
            notifyError(
                "Password must contain at least 6 characters, one uppercase and one lowercase letter"
            );
            return;
        }

        // Check if the password and confirmation match
        if (passwordValue !== confirmationValue) {
            notifyError("Passwords do not match");
            return;
        }

        try {
            await createUser(email, passwordValue);
            // If createUser is successful, then post to the backend
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                notifyError("Email already in use");
                return;
            } else {
                notifyError("An error occurred. Please try again later.");
                return;
            }
        }

        const user = {
            name: name,
            email: email,
            username: username,
            profilepic: "https://i.ibb.co/hYbbGyR/6596121-modified.png",
        };

        axiosSecure
            .post("/users/", user)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });

        await updateUserProfile(
            user,
            name,
            "https://i.ibb.co/hYbbGyR/6596121-modified.png"
        )
            .then(() => {
                logout();
                setLoading(false);
            })
            .catch((error) => {
                notifyError(error.code);
            });

        if (!loading) {
            notifySuccess("Account created successfully");
            // Log out the user
            navigate("/login");
        }
    };

    const handleGoogleLogin = async () => {
        console.log("in google login");
        try {
            const result = await googleLogin();
            const user = result.user; // get the user info from the result
    
            // Create a user object
            const newUser = {
                name: user.displayName,
                email: user.email,
                username: user.email.split('@')[0], 
                profilepic: user.photoURL || "https://i.ibb.co/hYbbGyR/6596121-modified.png",
            };
    
            // Post the user to the backend
            axiosSecure
                .post("/users/", newUser)
                .then((response) => {
                    setUserInfo(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
    
            if (!loading) {
                notifySuccess("Logged in successfully");
                navigate(location?.state ? location.state : "/");
            }
        } catch (error) {
            notifyError("An error occurred. Please try again later.");
        }
    };

    return (
        <section className="lg:w-full flex items-center justify-center mt-20">
            <div className=" animate__animated animate__fadeIn xl:mx-auto xl:min-w-fit custom-shadow p-4 xl:max-w-sm 2xl:max-w-md rounded-lg border-8 border-black mx-3">
                <div className="mb-2 flex justify-center"></div>
                <h2 className="text-center text-2xl font-bold leading-tight text-black">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have a LightBulb account?{" "}
                    <Link to="/login" className="text-primary font-extrabold">
                        Login
                    </Link>
                </p>
                <form className="mt-2" onSubmit={(e) => handleRegister(e)}>
                    <div className="space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="Full Name"
                                    type="text"
                                    name="name"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                    required
                                />
                            </div>
                        </div>
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
                            <label className="text-base font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    placeholder="username"
                                    type="text"
                                    name="username"
                                    className="flex h-10 w-full rounded-md border border-primary bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col justify-between gap-3">
                            <div className="w-full">
                                <div className="flex items-center justify-between ">
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
                            <div className="w-full">
                                <div className="flex items-center justify-between ">
                                    <label className="text-base font-medium text-gray-900">
                                        Confirm Password
                                    </label>
                                </div>
                                <div className="mt-2 relative">
                                    <PasswordInput
                                        name="confirmation"
                                        placeholder="Confirm Password"
                                        onValueChange={(value) =>
                                            setConfirmation(value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-accent"
                                type="submit"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>

                {/* or continue with Google */}
                <div className="flex items-center text-center text-sm text-gray-900 w-full my-3">
                    <hr className="flex-grow my-4 border-gray-300" />
                    <span className="mx-2">Or continue with</span>
                    <hr className="flex-grow my-4 border-gray-300" />
                </div>
                <button
                    className="relative inline-flex w-full items-center justify-center rounded-md border border-secondary bg-primary px-3.5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-accent  focus:bg-gray-100  focus:outline-none"
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    <span className="mr-2 inline-block">
                        <FcGoogle className="h-6 w-6" />
                    </span>
                    Sign up with Google
                </button>
                <div>
                    <p className="mt-3 text-center text-sm text-gray-600">
                        By signing up, you agree to our{" "}
                        <Link to="/#" className="text-primary font-extrabold">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-primary font-extrabold">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;
