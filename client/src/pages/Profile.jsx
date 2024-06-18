import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import ProfileStats from "../components/ProfileStats";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Communities from "./Communities";
import Loader from "../components/FunctionalComponents/Loader";
import SearchBar from "../components/Shared/SearchBar";

const Profile = () => {
    const { userInfo } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosSecure.get(`/users/${userInfo._id}/userdata`).then((response) => {
            setProfileData(response.data);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className=" max-w-5xl mx-auto mt-10">
            <div className="flex flex-col gap-10 min-h-dvh items-center justify-center">
                <div className="flex gap-10">
                    <div className="p-10 bg-accent rounded-xl text-white min-h-96 max-w-96">
                        <div className="flex gap-5 text-xl">
                            {/* user profile image */}
                            <img
                                src={profileData?.user?.profilepic}
                                alt="profile"
                                className="rounded-full w-32 h-32"
                            />
                            <p>@{profileData?.user?.username}</p>
                        </div>
                        {/* user display name */}
                        <p className="text-2xl font-medium mt-3">
                            {profileData?.user?.name}
                        </p>
                        <p className="text-xl font-medium">About:</p>
                        {/* replace with actual about from db */}
                        <p>{profileData?.user?.about}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                        {/* <SearchBar/> */}
                        <div className="grid grid-cols-2 gap-5">
                            {/* replace with stats for each */}
                            <ProfileStats
                                title={"Followers"}
                                stat={profileData?.followers?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Following"}
                                stat={profileData?.following?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Communities"}
                                stat={profileData?.communities?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Blogs"}
                                stat={profileData?.blogs?.length}
                            ></ProfileStats>
                        </div>
                        {/* buttons for drafts and my communities */}
                        <div className="my-5">
                            <Link to={"/drafts"} className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent">
                                My Drafts
                            </Link >
                            <Link
                                to="/communities/my-communities"
                                className="bg-primary text-white px-5 py-2 rounded-lg ml-5 hover:bg-accent"
                            >
                                My Communities
                            </Link>
                            <Link
                                to="/blogs/my-blogs"
                                className="bg-primary text-white px-5 py-2 rounded-lg ml-5 hover:bg-accent"
                            >
                                My Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
