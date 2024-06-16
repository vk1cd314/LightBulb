import { Link, NavLink, Outlet } from "react-router-dom";

const Blogs = () => {
    const active = "text-accent border-b-[3px] border-accent";
    const inactive = "hover:text-accent border-b-[3px] border-transparent";

    return (
        <div className="mt-20 max-w-6xl mx-auto">
            <div className="flex justify-end">
            <Link to={{ pathname: "/blog/create", state: 'blogs'  }} className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full">New Post</Link>
            </div>
            <div>
                <ul className="flex gap-5 justify-center text-2xl font-bold">
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
                </ul>
            </div>
            <Outlet />
        </div>
    );
};

export default Blogs;