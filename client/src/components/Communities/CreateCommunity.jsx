import { useState } from "react";
import { MdOutlineDoNotDisturbAlt, MdPublic } from "react-icons/md";
import { PiDetectiveFill } from "react-icons/pi";

const CreateCommunity = () => {
    const [activeButton, setActiveButton] = useState("public");
    const [communityName, setCommunityName] = useState("");

    const handleButtonClick = (type) => {
        setActiveButton(type);
    };

    const handleSubmit = () => {
        console.log(communityName, activeButton);
    };

    return (
        <div className="max-w-lg mx-auto flex flex-col justify-center h-dvh">
            <p className="font-bold text-3xl text-center">Create Community</p>
            <p className="text-center font-medium">
                Build and grow a community about something you care about.
                <br></br>We&apos;ll help you to set things up.
            </p>
            <p className="text-2xl mt-8 font-bold">Name</p>
            <input
                type="text"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 py-2 mt-2"
                placeholder="Name of your community"
                required
                onChange={(e) => setCommunityName(e.target.value)}
            />
            <div className="flex space-x-4 mt-10 justify-center">
                <button
                    className={`px-4 py-2 rounded-lg gap-2 flex justify-center ${
                        activeButton === "public"
                            ? "bg-accent text-white"
                            : "bg-gray-200 text-black"
                    }`}
                    onClick={() => handleButtonClick("public")}
                >
                    <MdPublic className="text-2xl" />
                    Public
                </button>
                <button
                    className={`px-4 py-2 rounded-lg gap-2 flex justify-center ${
                        activeButton === "restricted"
                            ? "bg-accent text-white"
                            : "bg-gray-200 text-black"
                    }`}
                    onClick={() => handleButtonClick("restricted")}
                >
                    <MdOutlineDoNotDisturbAlt className="text-2xl" />
                    Restricted
                </button>
                <button
                    className={`px-4 py-2 rounded-lg gap-2 flex justify-center ${
                        activeButton === "private"
                            ? "bg-accent text-white"
                            : "bg-gray-200 text-black"
                    }`}
                    onClick={() => handleButtonClick("private")}
                >
                    <PiDetectiveFill className="text-2xl" />
                    Private
                </button>
            </div>
            <div className="flex justify-center">
                <button
                    to="/create-community"
                    className="px-3 py-2 bg-primary hover:bg-accent text-white font-bold w-fit rounded-full mt-8 "
                    onClick={handleSubmit}
                >
                    Create Community
                </button>
            </div>
        </div>
    );
};

export default CreateCommunity;
