import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import CommentBox from "../components/Shared/CommentBox";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";

const BlogPage = () => {
    const id = useParams().id;

    const axiosSecure = useAxiosSecure();

    const [blogDetails, setBlogDetails] = useState({});
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        // fetch blog
        axiosSecure.get(`/blogs/${id}/details`).then((response) => {
            console.log(response.data);
            setBlogDetails(response.data);
        });
    }, [id]);

    const handleLike = () => {
        const blogLike = {
            uid: userInfo._id,
            blogid: id,
        }
        axiosSecure.post(`/blogs/${id}/like`, blogLike).then((response) => {
            console.log(response.data);
            setBlogDetails((prev) => {
                return {
                    ...prev,
                    blog: {
                        ...prev.blog,
                        likes: response.data.likes,
                    },
                };
            });
        });
    }

    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-center mt-20">
                    {blogDetails?.blog?.title}
                </h1>
                <div className="flex justify-center my-5">
                    <img
                        className="rounded-full size-12"
                        src={blogDetails?.user?.profilepic}
                    />
                    <div className="ml-3">
                        <h1 className="font-bold">{blogDetails?.user?.name}</h1>
                        <p className="text-gray-500">
                            {blogDetails?.blog?.created_at}
                        </p>
                    </div>
                </div>
            </div>
            <div className="min-h-dvh max-w-5xl mx-auto">
                <hr className="my-5 border border-gray-300" />
                <div
                    className="prose max-w-5xl p-5 "
                    dangerouslySetInnerHTML={{
                        __html: blogDetails?.blog?.content,
                    }}
                ></div>
                <hr className="my-5 border border-gray-300" />
                {/* like, comment count */}
                <div className="flex gap-10">
                    <div className="flex items-center">
                        <BiComment className="mr-1 text-xl" />
                        <p>{blogDetails?.blog?.comments.length}</p>
                    </div>
                    <div className="flex items-center">
                        <FaThumbsUp className="mr-1 text-xl" onClick={handleLike}/>
                        <p>{blogDetails?.blog?.likes.length}</p>
                    </div>
                </div>
                {/* all comments */}
                <h1 className="font-bold text-2xl my-10">Comments</h1>
                <div className="flex flex-col items-end">
                    <div className="flex gap-5 w-full">
                        <img
                            className="rounded-full size-12"
                            src={userInfo.profilepic}
                        />
                        <textarea
                            type="text"
                            placeholder="Comment"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button className="mt-4 px-3 py-2 bg-accent text-white font-bold w-fit rounded-full">
                        Post Comment
                    </button>
                </div>
                {blogDetails?.blog?.comments.map((comment) => {
                    return (
                        <CommentBox
                            key={comment._id}
                            author={comment.user.name}
                            content={comment.content}
                            date={comment.created_at}
                            authorProfilePic={comment.user.profilepic}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default BlogPage;
