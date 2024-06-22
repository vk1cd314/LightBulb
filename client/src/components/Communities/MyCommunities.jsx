import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CommunitiesCard from "../Shared/CommunitiesCard";
import { AuthContext } from "../../Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
const MyCommunities = () => {
    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);

    const fetchCommunities = async () => {
        const { data } = await axiosSecure.get(`/communities/community/${userInfo._id}`)
        return data;
    };

    const { data: communities, isLoading, refetch } = useQuery({
        queryKey: ["mycommunities", { userId: userInfo._id }],
        queryFn: fetchCommunities,
    });
    
    const handleJoin = (community, userInfo) => {
        console.log("Joining community");
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

export default MyCommunities;
