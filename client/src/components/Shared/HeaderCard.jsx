import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Auth/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const HeaderCard = ({author, title, date, blogid, likes, comments, authorProfilePic, authorid, handleDelete}) => {
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const { userInfo } = useContext(AuthContext);
    return (
        <div className="flex flex-col max-w-4xl p-5 border-2 border-gray-200 w-full space-y-4 rounded-lg">
            <Link to={`/b/${blogid}`} className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        className="rounded-full size-14"
                        src={authorProfilePic}
                    />
                    <div className="ml-3">
                        <h1 className="font-bold">{author}</h1>
                        <p className="text-gray-500">{date}</p>
                    </div>
                </div>
                <h1 className="font-bold text-xl">
                    {`${title}`.substring(0, 80)}
                </h1>
            </Link>
            {/* likes and comments */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex items-center mr-5">
                        <BiComment className="mr-1" />
                        <p>{comments.length}</p>
                    </div>
                    <div className="flex items-center">
                        <FaThumbsUp className="mr-1" />
                        <p>{likes.length}</p>
                    </div>
                </div>
                {/* delete button */}
                {
                    userInfo._id === authorid && location.pathname === "/blogs/my-blogs" && (
                        <button className="text-white text-sm hover:cursor-pointer font-bold bg-red-500 px-2 py-1 rounded-2xl" onClick={() => handleDelete(blogid)}>Delete</button>
                    )
                }
            </div>
        </div>
    );
};

HeaderCard.propTypes = {
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    blogid: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    authorProfilePic: PropTypes.string.isRequired,
    authorid: PropTypes.string.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default HeaderCard;
