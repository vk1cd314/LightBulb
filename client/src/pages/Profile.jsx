import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import ProfileStats from "../components/ProfileStats";
import { Link } from "react-router-dom";


const Profile = () => {
    const { userInfo } = useContext(AuthContext);


    

    return (
        <div className=" max-w-4xl mx-auto ">
            <div className="flex flex-col gap-10 h-dvh items-center justify-center">
                <div className="flex gap-10">
                    <div className="p-10 bg-accent rounded-xl text-white min-h-96">
                        <div className="flex gap-5 text-xl">
                            {/* user profile image */}
                            <img
                                src={userInfo.profilepic}
                                alt="profile"
                                className="rounded-full w-32 h-32"
                            />
                            {/* replace with actual username from db */}
                            <p>@{userInfo.username}</p>
                        </div>
                        {/* user display name */}
                        <p className="text-2xl font-medium mt-3">
                            {userInfo.name}
                        </p>
                        <p className="text-xl font-medium">About:</p>
                        {/* replace with actual about from db */}
                        <p>{userInfo.about}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {/* replace with stats for each */}
                        <ProfileStats
                            title={"Followers"}
                            stat={9860}
                        ></ProfileStats>
                        <ProfileStats
                            title={"Following"}
                            stat={13435}
                        ></ProfileStats>
                        <ProfileStats
                            title={"Communities"}
                            stat={531}
                        ></ProfileStats>
                        <ProfileStats title={"Blogs"} stat={832}></ProfileStats>
                    </div>
                </div>
                {/* buttons for drafts and my communities */}
                <div>
                    <button className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent">
                        My Drafts
                    </button>
                    <Link
                        to="/communities/my-communities"
                        className="bg-primary text-white px-5 py-2 rounded-lg ml-5 hover:bg-accent"
                    >
                        My Communities
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
