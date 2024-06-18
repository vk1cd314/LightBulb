import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CommunitiesCard from "../Shared/CommunitiesCard";
import Loader from "../FunctionalComponents/Loader";
import { MessageContext } from "../../pages/Root";
const ExploreCommunities = () => {
    const axiosSecure = useAxiosSecure();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { notifyError, notifySuccess } = useContext(MessageContext);

    useEffect(() => {
        setLoading(true);
        axiosSecure
            .get("/communities")
            .then((res) => {
                console.log(res.data);
                setCommunities(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleJoin = (community, userInfo) => {
        // /communities/667139a3122e0584a471f4e1/join?user_id=666f4f7c0ff501da0bfeb624
        console.log("Joining community");
        console.log(`/communities/${community._id}/${userInfo._id}/join`);
        axiosSecure
            .put(`/communities/${community._id}/${userInfo._id}/join`)
            .then((res) => {
                console.log(res.data);
                notifySuccess("Joined community successfully");
                setLoading(true);
                // Fetch communities again
                axiosSecure
                    .get("/communities")
                    .then((res) => {
                        console.log(res.data);
                        setCommunities(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((err) => {
                console.log(err);
                notifyError("Error joining community");
            });
    };

    if (loading) {
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
