import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CommunitiesCard from "../Shared/CommunitiesCard";
import { MessageContext } from "../../pages/Root";
import { useMutation, useQuery } from "@tanstack/react-query";
const ExploreCommunities = () => {
    const axiosSecure = useAxiosSecure();
    const { notifyError, notifySuccess } = useContext(MessageContext);

    const fetchCommunities = async () => {
        const { data } = await axiosSecure.get("/communities");
        return data;
    };

    const { data: communities, isLoading, refetch } = useQuery({
        queryKey: ["explorecommunities"],
        queryFn: fetchCommunities,
    });

    const joinMutation = useMutation({
        mutationFn: ({ communityId, userId }) =>
            axiosSecure.put(`/communities/${communityId}/${userId}/join`),
        onSuccess: () => {
            notifySuccess("Joined community successfully");
            refetch();
        },
        onError: () => {
            notifyError("Error joining community");
        },
    });
    
    const handleJoin = (community, userInfo) => {
        joinMutation.mutate({ communityId: community._id, userId: userInfo._id });
    };
    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className=" max-w-5xl mx-auto  mt-10 min-h-[calc(100dvh-200px)]">
            <div className="grid grid-cols-2 gap-3">
                {communities.map((community) => (
                    <CommunitiesCard
                        key={community._id}
                        community={community}
                        handleJoin={handleJoin}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExploreCommunities;
