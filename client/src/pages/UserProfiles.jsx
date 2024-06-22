import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import ProfileStats from "../components/ProfileStats";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import Loader from "../components/FunctionalComponents/Loader";
import { MessageContext } from "./Root";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserProfiles = () => {
    const userId = useParams().id;
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { userInfo: currentUser } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const queryClient = useQueryClient();

    if (currentUser._id === userId) {
        navigate("/profile");
    }

    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ["userData", userId],
        queryFn: () => axiosSecure.get(`/users/${userId}/userdata`).then(res => res.data),
    });

    const { data: followingStatus, isLoading: isFollowingStatusLoading } = useQuery({
        queryKey: ["followingStatus", currentUser._id, userId],
        queryFn: () => axiosSecure.get(`/users/followingtype`, {
            uid1: currentUser._id,
            uid2: userId,
        }).then(res => res.data.details),
    });

    const followMutation = useMutation({
        mutationFn: () => axiosSecure.post(`/users/follow`, { uid1: currentUser._id, uid2: userId }),
        onSuccess: (response) => {
            const isNowFollowing = response.data.detail !== "Successfully unfollowed";
            queryClient.setQueryData(["followingStatus", currentUser._id, userId], isNowFollowing);
            queryClient.invalidateQueries(["userData", userId]);
            notifySuccess(isNowFollowing ? "Followed user" : "Unfollowed user");
        },
        onError: () => {
            notifyError("Failed to update follow status");
        },
    });

    if (isUserDataLoading || isFollowingStatusLoading) {
        return <Loader />;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <div className="flex flex-col gap-10 min-h-dvh items-center justify-center">
                <div className="flex gap-10">
                    <div className="p-10 bg-accent rounded-xl text-white min-h-96 max-w-96">
                        <div className="flex gap-5 text-xl">
                            <img
                                src={userData?.user?.profilepic}
                                alt="profile"
                                className="rounded-full w-32 h-32"
                            />
                            <p>@{userData?.user?.username}</p>
                        </div>
                        <p className="text-2xl font-medium mt-3">
                            {userData?.user?.name}
                        </p>
                        <p className="text-xl font-medium">About:</p>
                        <p>{userData?.user?.about}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="grid grid-cols-2 gap-5">
                            <ProfileStats
                                title={"Followers"}
                                stat={userData?.followers?.length}
                            />
                            <ProfileStats
                                title={"Following"}
                                stat={userData?.following?.length}
                            />
                            <ProfileStats
                                title={"Communities"}
                                stat={userData?.communities?.length}
                            />
                            <ProfileStats
                                title={"Blogs"}
                                stat={userData?.blogs?.length}
                            />
                        </div>
                        <button
                            onClick={() => followMutation.mutate()}
                            className="px-3 py-2 bg-primary hover:bg-accent text-white font-bold w-fit rounded-lg mt-5"
                            disabled={followMutation.isLoading}
                        >
                            {followMutation.isLoading
                                ? "Updating..."
                                : followingStatus
                                ? "Unfollow"
                                : "Follow"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfiles;