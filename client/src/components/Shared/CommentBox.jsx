import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../../Auth/AuthProvider";

const ReplyBox = () => {
    return (
        <div>
            <p className="ml-2 my-2 font-medium">John Doe</p>
            <div className="flex gap-5">
            
                <img className="rounded-full size-12" src="https://randomuser.me/api/portraits" />
                <p className="w-full p-2 border-t border-gray-300 rounded-lg" >Great post!</p>
            </div>
        </div>
    );
};


const CommentBox = ({comment, handleDeleteComment}) => {
    const {userInfo} = useContext(AuthContext);

    return (
        <div className="mt-10 w-full border-2 border-gray-300 p-3 rounded-2xl flex gap-5">
            <img
                className="rounded-full size-12"
                src={comment.user_info.profilepic}
            />
            <div className="w-full">
                <div>
                    <h1 className="font-bold">{comment.user_info.name}</h1>
                    <p>{comment.comment.created_at}</p>
                </div>
                <hr className="my-5 border border-gray-300" />
                <p>{comment.comment.commentcontent}</p>

                {
                    userInfo._id === comment.user_info._id && (
                        <div className="flex my-3">
                            <button className="text-gray-500 text-sm hover:cursor-pointer font-bold underline underline-offset-4" onClick={() => handleDeleteComment(comment.comment)}>Delete</button>
                        </div>
                    )
                }

                {/* Replies */}
                <h2 className="font-bold text-lg my-5">Replies</h2>
                {/* reply button */}
                <div className="flex gap-5">
                    <img
                        className="rounded-full size-8"
                        src={userInfo.profilepic}
                    />
                    <textarea
                        type="text"
                        placeholder="Reply"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    </div>
                {/* <div className="space-y-4 my-4 ml-10">
                    <ReplyBox />
                    <ReplyBox />
                    <ReplyBox />
                </div> */}
            </div>
        </div>
    );
};

CommentBox.propTypes = {
    comment: PropTypes.object.isRequired,
    handleDeleteComment: PropTypes.func.isRequired,
};

export default CommentBox;
