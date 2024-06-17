import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import CommentBox from "../components/Shared/CommentBox";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";
import { MessageContext } from "../pages/Root";
import Loader from './../components/FunctionalComponents/Loader';

const BlogPage = () => {
    const id = useParams().id;

    const axiosSecure = useAxiosSecure();

    const [blogDetails, setBlogDetails] = useState({});
    const [blogComments, setBlogComments] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const [likes, setLikes] = useState(0);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch blog
        setLoading(true);
        Promise.all([
            axiosSecure.get(`/blogs/${id}/details`),
            axiosSecure.get(`/blogs/${id}/commentlist`),
        ])
            .then(([detailsResponse, commentsResponse]) => {
                console.log(detailsResponse.data);
                setBlogDetails(detailsResponse.data);
                setLikes(detailsResponse.data.blog.likes.length);

                console.log(commentsResponse.data);
                setBlogComments(commentsResponse.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleLike = () => {
        const blogLike = {
            uid: userInfo._id,
            blogid: id,
        };
        axiosSecure
            .post(`/blogs/${id}/like`, blogLike)
            .then((response) => {
                console.log(response.data);
                // if already liked, delete like
                if (response.data.details === "Already liked") {
                    axiosSecure
                        .delete(`/blogs/${id}/like`, {
                            data: blogLike,
                            headers: { "Content-Type": "application/json" },
                        })
                        .then((response) => {
                            console.log(response.data);
                            setLikes(likes - 1); // decrement likes
                            notifyError("Unliked the post");
                        });
                } else {
                    setLikes(likes + 1); // increment likes
                    notifySuccess("Liked the post");
                }
            })
    };

    const [comment, setComment] = useState("");

    const handleComment = () => {
        const commentData = {
            commentcontent: comment,
            uid: userInfo._id,
            blogid: id,
        };
        setLoading(true);
        axiosSecure
            .post(`/blogs/${id}/comment`, commentData)
            .then((response) => {
                console.log(response.data);
                notifySuccess("Comment posted successfully");
            })
            .catch((error) => {
                notifyError("Failed to post comment");
            })
            .finally(() => {
                setLoading(false);
            });

        //refetch comments
        setLoading(true);
        axiosSecure
            .get(`/blogs/${id}/commentlist`)
            .then((response) => {
                setBlogComments(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
        setComment("");
    };

    if(loading){
        return <Loader/>
    }

    const handleDeleteComment = (comment) => {
        console.log(comment);
        const commentbody = {
            uid: comment.uid,
            blogid: comment.blogid,
            cid: comment._id,
            commentcontent: comment.commentcontent,
        };
        console.log(commentbody);
        axiosSecure
            .delete(`/blogs/${comment.blogid}/${comment._id}/comment/`, {
                data: commentbody,
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                console.log(response.data);
                notifySuccess("Comment deleted successfully");
            })
            .catch((error) => {
                notifyError("Failed to delete comment");
            });
        setBlogComments(
            blogComments.filter(
                (currentComments) => currentComments._id !== comment._id
            )
        );
    };

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
                        <FaThumbsUp
                            className="mr-1 text-xl"
                            onClick={handleLike}
                        />
                        <p>{likes}</p>
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
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        className="mt-4 px-3 py-2 bg-accent text-white font-bold w-fit rounded-full"
                        onClick={handleComment}
                    >
                        Post Comment
                    </button>
                </div>
                {blogComments.map((comment) => {
                    return (
                        <CommentBox
                            key={comment.comment._id}
                            comment={comment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default BlogPage;
