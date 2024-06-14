import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";

const BlogCard = () => {
    return (
        <div className="flex flex-col max-w-5xl p-5 border-2 border-gray-200 w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        className="rounded-full size-8"
                        src="https://randomuser.me/api/portraits"
                    />
                    <div className="ml-3">
                        <h1 className="font-bold">John Doe</h1>
                        <p className="text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <h1 className="font-bold text-xl">
                    {"Blog title".substring(0, 80)}
                </h1>
            </div>
            {/* blog title */}
            {/* likes and comments */}
            <div className="flex items-center">
                <div className="flex items-center mr-5">
                    <BiComment className="mr-1" />
                    <p>12</p>
                </div>
                <div className="flex items-center">
                    <FaThumbsUp className="mr-1" />
                    <p>3</p>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
