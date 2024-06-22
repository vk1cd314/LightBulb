import { useContext, useState } from "react";
import { MdOutlineDoNotDisturbAlt, MdPublic } from "react-icons/md";
import { PiDetectiveFill } from "react-icons/pi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Auth/AuthProvider";
import { MessageContext} from "../../pages/Root"
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateCommunity = () => {
    const [communityName, setCommunityName] = useState("");
    const [communityTopic, setCommunityTopic] = useState("");
    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);
    const {notifySuccess, notifyError} = useContext(MessageContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const createCommnunityMutation = useMutation({
        mutationFn: (communityDetails) => axiosSecure.post("/communities", communityDetails),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["explorecommunities"]);
            queryClient.invalidateQueries(["mycommunities"]);
            queryClient.invalidateQueries(["community", data.data._id]);
            notifySuccess("Community created successfully");
            navigate(`/community/${data.data._id}`);
        },
        onError: () => {
            notifyError("Error creating community");
        },
    });

    const handleSubmit = () => {
        const communityDetails = {
            name: communityName,
            topic: communityTopic,
            memberlist: [userInfo._id],
        };

        if (communityName === "" || communityTopic === "") {
            notifyError("Please fill all the fields");
            return;
        }   

        createCommnunityMutation.mutate(communityDetails);
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
            <div className="flex gap-4 mt-10 justify-center items-center">
                <div className="flex items-center gap-4 justify-center">
                    <p className="font-bold text-xl">Topic: </p>
                    <input
                        type="text"
                        className="w-40 h-12 border border-gray-300 rounded-lg px-4 py-2 mt-2"
                        placeholder="Development"
                        onChange={(e) => setCommunityTopic(e.target.value)}
                        required
                    />
                </div>
                <button className="bg-accent text-white px-4 py-2 rounded-lg gap-2 flex justify-center items-center">
                    <MdPublic className="text-2xl" />
                    Public
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
