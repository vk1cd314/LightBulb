import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeaderCard = ({author, title, date, id, likes, comments, authorProfilePic}) => {
    console.log(author, title, date, id);
    return (
        <Link to={`/b/${id}`} className="flex flex-col max-w-4xl p-5 border-2 border-gray-200 w-full space-y-4 rounded-lg">
            <div className="flex items-center justify-between">
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
            </div>
            {/* blog title */}
            {/* likes and comments */}
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
        </Link>
    );
};

HeaderCard.propTypes = {
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    authorProfilePic: PropTypes.string.isRequired,
};

export default HeaderCard;
