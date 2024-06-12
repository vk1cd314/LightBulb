import { Link, NavLink, Outlet } from "react-router-dom";


const Communities = () => {
    const active = "text-accent border-b-[3px] border-accent";
    const inactive = "hover:text-accent border-b-[3px] border-transparent";




    return (
        <div className="mt-20 max-w-6xl mx-auto">
            <div className="flex justify-end">
                <Link to="/create-community" className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full">Create Community</Link>
            </div>
            <div>
                <ul className="flex gap-5 justify-center text-2xl font-bold">
                    <li>
                        <NavLink
                            to="/communities/explore"
                            className={({ isActive }) =>
                                isActive ? `${active}` : `${inactive}`
                            }
                        >
                            Explore
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
                </ul>
                <Outlet />
            </div>
        </div>
    );
};

export default Communities;