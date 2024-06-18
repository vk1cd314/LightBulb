import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PopularBlogsCard = ({ blog }) => {
    return (
        <div className="flex flex-col justify-between min-h-fit w-full border-2 border-gray-200 p-5 rounded-lg">
            <Link to={`/profile/${blog.user._id}`}>
                <div className="flex">
                    <img
                        className="rounded-full size-12"
                        src={blog.user.profilepic}
                    />
                    <div className="ml-3">
                        <h1 className="font-bold text-start">{blog.user.name}</h1>
                        <p className="text-gray-500">{blog.blog.created_at}</p>
                    </div>
                </div>
            </Link>
            {/* blog title */}
            <Link to={`/b/${blog.blog._id}`}>
                <h1 className="font-bold text-xl text-start my-2">
                    {`${blog.blog.title}`.substring(0, 24)}...
                </h1>
                {/* read more */}
                {/* dangerouslysetinner html */}
                <p
                    className="text-start"
                    dangerouslySetInnerHTML={{
                        __html: `${blog.blog.content}<strong>...<strong/>`
                    }}
                ></p>
            </Link>
            {/* likes and comments */}
            <div className="flex items-center">
                <div className="flex items-center mr-5">
                    <BiComment className="mr-1" />
                    <p>{blog.blog.comments.length}</p>
                </div>
                <div className="flex items-center">
                    <FaThumbsUp className="mr-1" />
                    <p>{blog.blog.likes.length}</p>
                </div>
            </div>
        </div>
    );
};

PopularBlogsCard.propTypes = {
    blog: PropTypes.object.isRequired,
};

export default PopularBlogsCard;
