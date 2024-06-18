import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Auth/AuthProvider";
import { Link } from "react-router-dom";
import { MessageContext } from "../../pages/Root";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ReplyBox = ({ reply, handleDeleteReply }) => {
    const { userInfo } = useContext(AuthContext);
    console.log(reply);
    return (
        <div className="border-2  p-2 rounded-lg">
            <p className="ml-2 my-2 font-semibold">{reply.user_info.name}</p>
            <div className="flex gap-5">
                <img
                    className="rounded-full size-12"
                    src={reply.user_info.profilepic}
                />
                <p className="w-full p-2 border-t border-gray-300 rounded-lg">
                    {reply.replycontent}
                </p>
            </div>
            {userInfo._id === reply?.uid && (
                <div className="flex my-3">
                    <button
                        className="text-gray-500 text-sm hover:cursor-pointer font-bold underline underline-offset-4"
                        onClick={() => handleDeleteReply(reply)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

const CommentBox = ({ comment, handleDeleteComment }) => {
    const { userInfo } = useContext(AuthContext);
    const [reply, setReply] = useState("");
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const axiosSecure = useAxiosSecure();
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        axiosSecure
            .get(`/blogs/${comment.comment._id}/replies`)
            .then((response) => {
                setReplies(response.data);
                console.log(replies);
            })
            .catch((error) => {
                notifyError("Failed to fetch replies");
            });
    }, []);

    const handleReply = () => {
        if (reply === "") {
            notifyError("Reply cannot be empty");
            return;
        }

        const newReply = {
            cid: comment.comment._id,
            uid: userInfo._id,
            blogid: comment.comment.blogid,
            replycontent: reply,
        };
        // /blogs/{blog_id}/{comment_id}/reply

        axiosSecure
            .post(
                `/blogs/${comment.comment.blogid}/${comment.comment._id}/reply`,
                newReply
            )
            .then((response) => {
                notifySuccess("Reply posted successfully");
                // refetch replies
                axiosSecure
                    .get(`/blogs/${comment.comment._id}/replies`)
                    .then((response) => {
                        setReplies(response.data);
                        console.log(replies);
                    })
                    .catch((error) => {
                        notifyError("Failed to fetch replies");
                    });
            })
            .catch((error) => {
                notifyError("Failed to post reply");
            });
            setReply("");
    };

    const handleDeleteReply = (reply) => {

        axiosSecure
            .delete(`/blogs/${reply._id}/reply`, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                notifySuccess("Reply deleted successfully");
                // refetch replies
                axiosSecure
                    .get(`/blogs/${comment.comment._id}/replies`)
                    .then((response) => {
                        setReplies(response.data);
                        console.log(replies);
                    })
                    .catch((error) => {
                        notifyError("Failed to fetch replies");
                    });
            })
            .catch((error) => {
                notifyError("Failed to delete reply");
            });
    };

    return (
        <div className="mt-10 w-full border-2 border-gray-300 p-3 rounded-2xl flex gap-5">
            <Link to={`/profile/${comment?.user_info?._id}`}>
                <img
                    className="rounded-full size-12"
                    src={comment?.user_info.profilepic}
                />
            </Link>
            <div className="w-full">
                <div>
                    <h1 className="font-bold">{comment.user_info.name}</h1>
                    <p>{comment?.comment.created_at}</p>
                </div>
                <hr className="my-5 border border-gray-300" />
                <p>{comment?.comment.commentcontent}</p>

                {userInfo._id === comment?.user_info._id && (
                    <div className="flex my-3">
                        <button
                            className="text-gray-500 text-sm hover:cursor-pointer font-bold underline underline-offset-4"
                            onClick={() =>
                                handleDeleteComment(comment?.comment)
                            }
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* Replies */}
                <h2 className="font-bold text-lg my-5">Replies</h2>
                {/* reply button */}
                <div className="flex gap-5 items-center">
                    <img
                        className="rounded-full size-12"
                        src={userInfo.profilepic}
                    />
                    <textarea
                        type="text"
                        placeholder="Reply"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                        className=" h-fit px-3 py-2 bg-accent text-white font-bold w-fit rounded-lg"
                        onClick={handleReply}
                    >
                        Reply
                    </button>
                </div>

                <div className="space-y-4 my-4 ml-10">
                    {replies.map((reply) => {
                        return (
                            <ReplyBox
                                key={reply._id}
                                reply={reply}
                                handleDeleteReply={handleDeleteReply}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

CommentBox.propTypes = {
    comment: PropTypes.object.isRequired,
    handleDeleteComment: PropTypes.func.isRequired,
};

export default CommentBox;
