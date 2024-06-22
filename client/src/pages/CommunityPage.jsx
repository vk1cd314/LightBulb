import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";
import { MessageContext } from "../pages/Root";
import HeaderCard from "../components/Shared/HeaderCard";
import Loader from "./../components/FunctionalComponents/Loader";

const CommunityPage = () => {
    const axiosSecure = useAxiosSecure();
    const communityId = useParams().id;
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const queryClient = useQueryClient();

    const { data: community, isLoading } = useQuery({
        queryKey: ["community", communityId],
        queryFn: () => axiosSecure.get(`/communities/${communityId}`).then(res => res.data),
    });

    const leaveMutation = useMutation({
        mutationFn: () => axiosSecure.put(`/communities/${communityId}/leave?user_id=${userInfo._id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["community", communityId]);
            queryClient.invalidateQueries(["explorecommunities"]);
            notifySuccess("Left Community Successfully");
            navigate("/communities/explore");
        },
        onError: () => {
            notifyError("Error leaving community");
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    const adminID = community?.users[0]?._id;

    return (
        <div className="flex mt-20">
            <div className="max-w-6xl flex flex-col mx-auto min-h-dvh w-full">
                <h1 className="text-3xl font-bold text-center mt-20 underline underline-offset-4">
                    {community?.community?.name}
                </h1>
                <p className="text-center mt-2 font-bold text-gray-500">
                    {community?.community?.topic}
                </p>
                {community?.community?.memberlist.includes(userInfo._id) && (
                    <div className="flex items-center gap-2 justify-end">
                        <Link
                            to={`/community/${communityId}/create`}
                            className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg hover:cursor-pointer"
                        >
                            Create Blog
                        </Link>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer"
                            onClick={() => leaveMutation.mutate()}
                        >
                            Leave Community
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-5 mt-10">
                    {community?.blogs &&
                        community?.blogs.map((blog) => (
                            <HeaderCard
                                key={blog.blog._id}
                                title={blog.blog.title}
                                author={blog.user.name}
                                authorid={blog.user._id}
                                date={blog.blog.updated_at || blog.blog.created_at}
                                blogid={blog.blog._id}
                                likes={blog.blog.likes}
                                comments={blog.blog.comments}
                                authorProfilePic={blog.user.profilepic}
                            />
                        ))}
                </div>
            </div>
            <div className="w-60 max-h-[calc(100dvh-200px)] border-2 p-2 border-gray-500 rounded-bl-2xl rounded-tl-2xl overflow-y-auto">
                <p className="text-2xl font-bold text-center mt-10 sticky">
                    Members
                </p>
                <hr className="borde w-full border-gray-300 my-3" />
                <div className="flex flex-col items-center space-y-3 ">
                    {community?.community?.memberlist &&
                        community?.users.map((user) => (
                            <Link
                                to={`/profile/${user._id}`}
                                key={user._id}
                                className="flex items-center gap-2 rounded-2xl hover:bg-gray-300 px-3 py-2 w-full"
                            >
                                <img
                                    src={user?.profilepic}
                                    className="rounded-full size-12 border-2 border-black"
                                />
                                <p className="flex items-center gap-3">
                                    {user?.username}{" "}
                                    {user?._id === adminID && (
                                        <p className="text-xl text-gray-500">
                                            👑
                                        </p>
                                    )}
                                </p>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;