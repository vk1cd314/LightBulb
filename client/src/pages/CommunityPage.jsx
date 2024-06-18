import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link, useParams } from "react-router-dom";


const CommunityPage = () => {
    const [community, setCommunity] = useState([])
    const axiosSecure = useAxiosSecure();
    const communityId = useParams().id;

    useEffect(() => {
        axiosSecure.get(`/communities/${communityId}`).then((res) => {
            setCommunity(res.data);
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div className="max-w-6xl flex flex-col mx-auto">
            <h1 className="text-3xl font-bold text-center mt-20 underline underline-offset-4">{community.name}</h1>
            <p className="text-center mt-2 font-bold text-gray-500">{community.topic}</p>
            {/* create blog button */}
            <Link to={`/community/${communityId}/create`} className="flex justify-end">
                <button className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg hover:cursor-pointer">Create Blog</button>
            </Link>
            <div className="flex flex-col items-center mt-10 space-y-3">

            </div>
        </div>
    );
};

export default CommunityPage;