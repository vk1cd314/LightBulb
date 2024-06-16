import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import CommentBox from "../components/Shared/CommentBox";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const BlogPage = () => {
    const id = useParams().id;

    const axiosSecure = useAxiosSecure();

    const [blogDetails, setBlogDetails] = useState({});

    useEffect(() => {
        // fetch blog
        axiosSecure.get(`/blogs/${id}/details`).then((response) => {
            console.log(response.data);
            setBlogDetails(response.data);
        });
    }, [id]);

    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-center mt-20">
                    {blogDetails?.blog?.title}
                </h1>
                <div className="flex justify-center my-5">
                    <img
                        className="rounded-full size-12"
                        src={blogDetails?.user?.profilepic}
                    />
                    <div className="ml-3">
                        <h1 className="font-bold">{blogDetails?.user?.name}</h1>
                        <p className="text-gray-500">{blogDetails?.blog?.created_at}</p>
                    </div>
                </div>
            </div>
            <div className="min-h-dvh max-w-5xl mx-auto">
                <hr className="my-5 border border-gray-300" />
                <div
                    className="prose max-w-5xl p-5 "
                    dangerouslySetInnerHTML={{ __html: blogDetails?.blog?.content }}
                ></div>
                <hr className="my-5 border border-gray-300" />
                {/* like, comment count */}
                <div className="flex gap-10">
                    <div className="flex items-center">
                        <BiComment className="mr-1" />
                        <p>12</p>
                    </div>
                    <div className="flex items-center">
                        <FaThumbsUp className="mr-1" />
                        <p>3</p>
                    </div>
                </div>
                {/* all comments */}
                <h1 className="font-bold text-2xl my-10">Comments</h1>
                <CommentBox />
                <CommentBox />
                <CommentBox />
            </div>
        </>
    );
};

export default BlogPage;
