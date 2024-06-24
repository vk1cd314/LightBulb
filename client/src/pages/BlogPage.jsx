import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import CommentBox from "../components/Shared/CommentBox";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";

import Loader from "./../components/FunctionalComponents/Loader";
import { MessageContext } from "./Root";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BlogPage = () => {
    const id = useParams().id;

    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);
    const [likes, setLikes] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const [isLikeDisabled, setIsLikeDisabled] = useState(false);

    const { data: blogDetails, isLoading: blogsLoading } = useQuery({
        queryKey: ["blogDetails", id],
        queryFn: () =>
            axiosSecure.get(`/blogs/${id}/details`).then((res) => res.data),
        enabled: true,
        onSuccess: (data) => {
            setLikes(data.blog.likes.length);
            setCommentCount(data.blog.comments.length);
        },
    });

    const { data: blogComments } = useQuery({
        queryKey: ["blogComments", id],
        queryFn: () =>
            axiosSecure.get(`/blogs/${id}/commentlist`).then((res) => res.data),
        enabled: true,
    });

    const queryClient = useQueryClient();

    const deleteLikeMutation = useMutation({
        mutationFn: (data) => axiosSecure.delete(`/blogs/${id}/like`, data),
        onMutate: () => {
            setIsLikeDisabled(true);
        },
        onSuccess: (response) => {
            setLikes(likes => likes - 1);
            notifyError("Unliked the post");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["blogDetails", id]);
            setIsLikeDisabled(false);
        },
    });


    const likeMutation = useMutation({
        mutationFn: (data) => axiosSecure.post(`/blogs/${id}/like`, data),
        onMutate: () => {
            setIsLikeDisabled(true);
        },
        onSuccess: (response) => {
            if (response.data.details === "Already liked") {
                axiosSecure.delete(`/blogs/${id}/like`, {
                    data: {uid: userInfo._id, blogid: id},
                    headers: { "Content-Type": "application/json" },
                })
                .then(() => {
                    setLikes(likes => likes - 1);
                    notifyError("Unliked the post");
                })
                .catch(() => {
                    setLikes(likes => likes - 1);
                    notifyError("Failed to unlike the post");
                });
            } else {
                setLikes(likes => likes + 1);
                notifySuccess("Liked the post");
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(["blogDetails", id]);
            setIsLikeDisabled(false);
        },
    });

    const handleLike = () => {
        if (isLikeDisabled) return;

        const blogLike = {
            uid: userInfo._id,
            blogid: id,
        };
        likeMutation.mutate(blogLike);
    };

    const [comment, setComment] = useState("");

    const handleComment = () => {
        if (comment === "") {
            notifyError("Comment cannot be empty");
            return;
        }
        const commentData = {
            commentcontent: comment,
            uid: userInfo._id,
            blogid: id,
        };
        axiosSecure
            .post(`/blogs/${id}/comment`, commentData)
            .then((response) => {
                console.log(response.data);
                notifySuccess("Comment posted successfully");
                setCommentCount(commentCount + 1);
                // refetch comments
                return axiosSecure.get(`/blogs/${id}/commentlist`);
            })
            .then((response) => {})
            .catch((error) => {
                notifyError("Failed to post comment");
            })
            .finally(() => {});

        setComment("");
    };

    if (blogsLoading) {
        return <Loader />;
    }

    const handleDeleteComment = (comment) => {
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
                notifySuccess("Comment deleted successfully");
                setCommentCount(commentCount - 1);
            })
            .catch((error) => {
                notifyError("Failed to delete comment");
            });
    };

    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-center mt-20">
                    {blogDetails?.blog?.title}
                </h1>
                <Link
                    to={`/profile/${blogDetails?.blog?.uid}`}
                    className="flex justify-center my-5"
                >
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
                </Link>
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
                        <p>{commentCount}</p>
                    </div>
                    <div className="flex items-center">
                        <FaThumbsUp
                            className={`mr-1 text-xl ${
                                isLikeDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                            onClick={handleLike}
                            disabled={isLikeDisabled}
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
                {blogComments &&
                    blogComments.map((comment) => {
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
