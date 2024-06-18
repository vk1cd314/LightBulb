import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Auth/AuthProvider";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const CommunitiesCard = ({community, handleJoin}) => {
    const { userInfo } = useContext(AuthContext);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const axiosSecure = useAxiosSecure();



    useEffect(() => {
        if(community.memberlist.includes(userInfo._id)){
            setIsUserJoined(true);
        }
    }, [community.memberlist, userInfo._id]);



    return (
        <div className="flex justify-between border border-gray-300 bg-white shadow-lg rounded-lg p-4">
            <Link to={`/community/${community._id}`}>
                <p className="text-xl font-bold">{community.name}</p>
                <p className="text-gray-500">{community.topic}</p>
            </Link>
            <div className="flex justify-end">
                <button className={`bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg ${isUserJoined ? "opacity-50 cursor-not-allowed" : ""}`}  onClick={()=> handleJoin(community, userInfo)} disabled={isUserJoined}>
                    {isUserJoined ? "Joined" : "Join"}
                </button>
            </div>
        </div>
    );
};

CommunitiesCard.propTypes = {
    community: PropTypes.object.isRequired,
    handleJoin: PropTypes.func.isRequired,
};

export default CommunitiesCard;
