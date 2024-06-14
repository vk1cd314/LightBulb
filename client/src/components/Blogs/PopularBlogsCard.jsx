import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";

const PopularBlogsCard = () => {
    return (
        <div className="flex flex-col min-h-fit w-full border-2 border-gray-200 p-5 rounded-lg">
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
            </div>
            {/* blog title */}
            <h1 className="font-bold text-xl text-start my-2">
                {"Blog title".substring(0, 80)}
            </h1>
            {/* read more */}
            <p className="text-gray-500 text-start">
                {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec est ut felis consectetur euismod. Nulla facilisi. Nullam nec est ut felis consectetur euismod. Nulla facilisi. Nullam nec est ut felis consectetur euismod. Nulla facilisi.".substring(
                    0,
                    80
                )}
                ...
            </p>
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

export default PopularBlogsCard;
