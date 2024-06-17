import { useLocation } from "react-router-dom";
import HeaderCard from "../Shared/HeaderCard";
import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Auth/AuthProvider";
import { MessageContext } from "../../pages/Root";

const AllBlogsCards = () => {
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const {notifySuccess, notifyError} = useContext(MessageContext);

    useEffect(() => {
        if (location.pathname === "/blogs/explore") {
            setLoading(true);
            axiosSecure
                .get("/blogs/1/allblogs")
                .then((response) => {
                    setBlogs(response.data.blogs);
                    console.log(response.data.blogs);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (location.pathname === "/blogs/my-blogs" && userInfo._id) {
            // fetch user blogs
            setLoading(true);
            axiosSecure
                .get(`/blogs/${userInfo._id}/users`)
                .then((response) => {
                    setBlogs(response.data.blogs);
                    console.log(response.data.blogs);
                })
                .then(() => {
                    setLoading(false);
                });
        }
    }, [location]);

    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const handleDelete = (blogid) => {
        setLoading(true);
        axiosSecure
            .delete(`/blogs/${blogid}`)
            .then((response) => {
                console.log(response.data);
                setBlogs(blogs.filter((blog) => blog.blog._id !== blogid));
                notifySuccess("Blog deleted successfully");
            })
            .catch((error) => {
                console.error(error);
                notifyError("Failed to delete blog");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            {blogs.map((blog) => {
                return (
                    <HeaderCard
                        key={blog.blog._id}
                        title={blog.blog.title}
                        author={blog.user.name}
                        authorid={blog.user._id}
                        date={blog.blog.updated_at || blog.blog.created_at}
                        blogid={blog.blog._id}
                        likes={blog.blog.likes}
                        comments={blog.blog.comments}
                        authorProfilePic={blog.user.profilepic}
                        handleDelete={handleDelete}
                    />
                );
            })}
        </div>
    );
};

export default AllBlogsCards;
