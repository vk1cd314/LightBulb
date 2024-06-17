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
            axiosSecure.get("/blogs/1/allblogs").then((response) => {
                setBlogs(response.data.blogs);
                console.log(response.data.blogs);
            });
        }

        if (location.pathname === "/blogs/my-blogs" && userInfo._id) {
            // fetch user blogs
            axiosSecure.get(`/blogs/${userInfo._id}/users`).then((response) => {
                setBlogs(response.data.blogs);
                console.log(response.data.blogs);
            });
        }
    }, [location]);
    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            { blogs.map((blog) => {
                return (
                    <HeaderCard
                        key={blog.blog._id}
                        title={blog.blog.title}
                        author={blog.user.name}
                        date={blog.blog.updated_at || blog.blog.created_at}
                        id={blog.blog._id}
                        likes={blog.blog.likes}
                        comments={blog.blog.comments}
                        authorProfilePic={blog.user.profilepic}
                    />
                );
            })}
        </div>
    );
};

export default AllBlogsCards;