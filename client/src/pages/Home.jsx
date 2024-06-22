import { Link } from "react-router-dom";
import PopularBlogsCard from "../components/Blogs/PopularBlogsCard";
import { useEffect, useState } from "react";
import useAxiosSecure from './../hooks/useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/FunctionalComponents/Loader";

const Home = () => {
    const [popularBlogs, setPopularBlogs] = useState([]);
    const axiosSecure = useAxiosSecure();

    const popularBlogsQuery = useQuery({
        queryKey: ["popularBlogs"],
        queryFn: async () => {
            const { data } = await axiosSecure.get("/blogs/123/trending");
            return data;
        }
    });

    useEffect(() => {
        if (popularBlogsQuery.isSuccess) {
            setPopularBlogs(popularBlogsQuery.data);
        }
    }, [popularBlogsQuery.isSuccess, popularBlogsQuery.data]);

    if (popularBlogsQuery.isLoading) {
        return <Loader />;
    }


    return (
        <div className="mt-20">
            {/* banner */}
            <div className="flex gap-10 items-center ml-20">
                <div>
                    <h1 className="text-5xl font-bold">
                        Discover the Latest Insights and Connect with Our
                        Vibrant Community
                    </h1>
                    <p className="text-xl mt-5">
                        Our blog and community platform offers a wealth of
                        knowledge and a supportive network for passionate
                        individuals. Explore thought-provoking articles, engage
                        in discussions, and connect with like-minded people.
                    </p>
                    {/* buttons */}
                    <div className="mt-10">
                        <Link
                            to="/blogs/explore"
                            className="px-5 py-3 bg-primary hover:bg-accent text-white font-bold rounded-lg mr-5"
                        >
                            Explore Blogs
                        </Link>
                        <Link to="/communities/explore" className="px-5 py-3 bg-primary hover:bg-accent text-white font-bold rounded-lg">
                            Explore Communities
                        </Link>
                    </div>
                </div>
                <img
                    src="https://i.ibb.co/dPyfgXy/image.png"
                    className="max-w-[calc(100dvw/2)]"
                    alt=""
                />
            </div>
            {/* popular blogs */}
            <div className="my-20 text-center  max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold">Featured Blog Posts</h1>
                <p className="font-medium text-xl max-w-3xl mx-auto">
                    Explore our latest blog posts on a variety of topics, from
                    industry insights to personal development.
                </p>
                <div className="flex justify-center gap-10 mt-10">
                    {/* pass the top 3 blogs as props */}
                    {popularBlogs.map((blog) => (
                        <PopularBlogsCard key={blog.blog._id} blog={blog} />
                    ))}
                </div>
            </div>
            {/* features */}
            <div className="my-10 flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold">
                    Key Features of Our Community
                </h1>
                <p className="text-xl mt-5 max-w-3xl">
                    Discover the benefits of being a part of our vibrant
                    community and how it can help you grow.
                </p>
            </div>
            <div className="max-w-5xl mx-auto flex gap-20 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mt-5">
                        Peer-to-Peer Learning
                    </h1>
                    <p>
                        Learn from experienced members and share your own
                        knowledge with the community.
                    </p>

                    <h1 className="text-2xl font-bold mt-5">
                        Exclusive Content
                    </h1>
                    <p>
                        Access in-depth articles, tutorials, and resources not
                        available anywhere else.
                    </p>

                    <h1 className="text-2xl font-bold mt-5">
                        Networking Opportunities
                    </h1>
                    <p>
                        Connect with like-minded individuals and build valuable
                        professional relationships.
                    </p>
                </div>
                <div className="size-96 rounded-full overflow-hidden">
                    <img
                        className="object-cover w-full h-full"
                        src="https://i.ibb.co/G9cSpwR/OIG4-z4-SHLK75-K4.jpg"
                        alt=""
                    />
                </div>
            </div>
            
        </div>
    );
};

export default Home;
