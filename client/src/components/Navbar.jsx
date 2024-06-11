import { Link, NavLink } from "react-router-dom";
import { FaMagnifyingGlass, FaUserAstronaut } from "react-icons/fa6";
import { AuthContext } from "../Auth/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../pages/Root";
import { IoMdLogOut } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";

const Navbar = () => {
    const active = "text-accent";
    const inactive = "hover:text-accent";
    const { user, logout, loading } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);

    const navItems = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Blog
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Notifications
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/communities/explore"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Communities
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Settings
                </NavLink>
            </li>
        </>
    );

    const handleLogout = async () => {
        try {
            await logout();
            notifySuccess("Logged out successfully");
        } catch (error) {
            notifyError("An error occurred. Please try again later.");
        }
    };

    const [search, setSearch] = useState("");

    const handleSearch = () => {
        // Search functionality
        console.log(search);
    };

    /**
     * Represents the logged out state of the Navbar component.
     * @type {JSX.Element}
     */
    const loggedOutState = (
        <>
            <div className="gap-2 items-center lg:flex hidden">
                <FaUserAstronaut className="text-primary" />
                <NavLink
                    to="/register"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Register
                </NavLink>
                <p>/</p>
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Login
                </NavLink>
            </div>
        </>
    );

    /**
     * Represents the logged-in state of the Navbar component.
     * @returns {JSX.Element} The JSX element representing the logged-in state.
     */
    const loggedInState = (
        <>
            <div className="flex gap-2 items-center">
                <Link className="profileImage" to="/profile">
                    <img
                        className="size-12 rounded-full"
                        src={user?.photoURL}
                        alt=""
                        title="View Profile"
                    />
                </Link>

                <button
                    onClick={handleLogout}
                    className="lg:py-2 lg:px-3 rounded-full bg-primary text-primary bg-opacity-20 border-primary border-2 hidden lg:flex items-center gap-2"
                >
                    <IoMdLogOut className="size-6" />
                </button>
            </div>
        </>
    );

    const [dropDown, setDropDown] = useState(false);

    /**
     * Toggles the dropdown state.
     */
    const handleDropDown = () => {
        setDropDown(!dropDown);
    };

    useEffect(() => {
        /**
         * Handles the click event outside of the dropdown and hamburger elements.
         * If the click is outside and the dropdown is open, it closes the dropdown.
         * @param {Event} event - The click event object.
         */
        const handleClickOutside = (event) => {
            if (
                dropDown &&
                event.target.closest(".dropdown") === null &&
                event.target.closest(".hamburger") === null
            ) {
                setDropDown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropDown]);

    const dropDownNavItems = (
        <>
            <li>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    My Profile
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/communities/explore"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Explore Communities
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/communities/my-communities"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    My Communities
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/blogs/explore"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    Explore Blogs
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/blogs/my-blogs"
                    className={({ isActive }) =>
                        isActive ? `${active}` : `${inactive}`
                    }
                >
                    My Blogs
                </NavLink>
            </li>
        </>
    );

    const loadingSkeleton = (
        <div className="flex gap-2 items-center animate-pulse">
            <div className="profileImage bg-gray-200 rounded-full h-12 w-12"></div>
            <button className="lg:py-2 lg:px-3 rounded-full bg-gray-200 text-gray-200 bg-opacity-20 border-gray-200 border-2 hidden lg:flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                Getting info
            </button>
        </div>
    );

    return (
        <>
            <div className="glass fixed w-full top-0 z-50 custom-shadow nav-glass">
                <nav className="lg:px-5 px-3 py-2 flex justify-between text-sm items-center lg:text-lg font-extrabold">
                    <Link to="/" className="flex items-center gap-2 text-4xl">
                        LightBulb
                    </Link>
                    {/* large screen nav items */}
                    <ul className="hidden font-bold lg:flex gap-4">{navItems}</ul>{" "}
                    {/* search bar */}
                    <div className="lg:flex items-center font-medium gap-3">
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border border-primary bg-transparent px-3 py-2 text-sm"
                        />
                        <button onClick={handleSearch} className="bg-primary text-white rounded-lg px-3 py-2">
                        <FaMagnifyingGlass />
                        </button>
                    </div>
                    {/* small screen nav items */}
                    <div className="flex items-center gap-3 relative">
                        {loading
                            ? loadingSkeleton
                            : user
                            ? loggedInState
                            : loggedOutState}{" "}
                        {/* right most element */}
                        <TiThMenu
                            onClick={handleDropDown}
                            className=" flex size-6 text-primary hamburger"
                        />
                        <div
                            className={`dropdown ${
                                dropDown ? "flex" : "hidden"
                            } absolute top-6 right-1 rounded-lg bg-white py-3 px-5 font-medium border border-primary w-56`}
                        >
                            <ul className="flex flex-col gap-3 font-medium text-lg">
                                {dropDownNavItems}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
