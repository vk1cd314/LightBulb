import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import ProfileStats from "../components/ProfileStats";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import Loader from "../components/FunctionalComponents/Loader";
import { MessageContext } from "./Root";

const UserProfiles = () => {
    const userId = useParams().id;
    const axiosSecure = useAxiosSecure();
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { userInfo: currentUser } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);

    if (currentUser._id === userId) {
        navigate("/profile");
    }

    useEffect(() => {
        setLoading(true);
        axiosSecure
            .get(`/users/${userId}/userdata`)
            .then((response) => {
                setUserInfo(response.data);
                console.log(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleFollow = () => {
        setLoading(true);
        axiosSecure
            .post(`/users/follow`, { uid1: currentUser._id, uid2: userId})
            .then((response) => {
                console.log(response.data);
                notifySuccess("User Followed");
                // refetch user data
                axiosSecure
                    .get(`/users/${userId}/userdata`)
                    .then((response) => {
                        setUserInfo(response.data);
                        console.log(response.data);
                    });
            })
            .catch((error) => {
                console.error(error);
                notifyError("Failed to follow user");
            })
            .then(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className=" max-w-5xl mx-auto mt-10">
            <div className="flex flex-col gap-10 min-h-dvh items-center justify-center">
                <div className="flex gap-10">
                    <div className="p-10 bg-accent rounded-xl text-white min-h-96 max-w-96">
                        <div className="flex gap-5 text-xl">
                            {/* user profile image */}
                            <img
                                src={userInfo?.user?.profilepic}
                                alt="profile"
                                className="rounded-full w-32 h-32"
                            />
                            {/* replace with actual username from db */}
                            <p>@{userInfo?.user?.username}</p>
                        </div>
                        {/* user display name */}
                        <p className="text-2xl font-medium mt-3">
                            {userInfo?.user?.name}
                        </p>
                        <p className="text-xl font-medium">About:</p>
                        {/* replace with actual about from db */}
                        <p>{userInfo?.user?.about}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="grid grid-cols-2 gap-5">
                            {/* replace with stats for each */}
                            <ProfileStats
                                title={"Followers"}
                                stat={userInfo?.followers?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Following"}
                                stat={userInfo?.following?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Communities"}
                                stat={userInfo?.communities?.length}
                            ></ProfileStats>
                            <ProfileStats
                                title={"Blogs"}
                                stat={userInfo?.blogs?.length}
                            ></ProfileStats>
                        </div>
                        <button
                            className="my-5 bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent"
                            onClick={handleFollow}
                        >
                            Follow
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfiles;
