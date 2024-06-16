import { useLocation } from "react-router-dom";
import HeaderCard from "../Shared/HeaderCard";
import { useContext, useEffect, useState,  } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Auth/AuthProvider";

const AllBlogsCards = () => {
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        if (location.pathname === "/blogs/explore") {
            axiosSecure.get("/blogs").then((response) => {
                setBlogs(response.data);
            });
        }

        if (location.pathname === "/blogs/my-blogs") {
            // fetch user blogs
            axiosSecure.get(`/blogs/${userInfo._id}/users`).then((response) => {
                setBlogs(response.data);
                console.log(response.data);
            });
        }
    }, [location]);
    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            {blogs.map((blog) => {
                return (
                    <HeaderCard
                        key={blog._id}
                        title={blog.title}
                        author={blog.author}
                        date={blog.date}
                        id={blog._id}
                    />
                );
            })}
        </div>
    );
};

export default AllBlogsCards;