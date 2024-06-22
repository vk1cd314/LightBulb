import { useLocation } from "react-router-dom";
import HeaderCard from "../Shared/HeaderCard";
import { useContext } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../Auth/AuthProvider";
import { MessageContext } from "../../pages/Root";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AllBlogsCards = () => {
    const location = useLocation();
    const axiosSecure = useAxiosSecure();
    const { userInfo } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);
    const queryClient = useQueryClient();

    const fetchBlogs = async () => {
        if (location.pathname === "/blogs/explore") {
            const response = await axiosSecure.get("/blogs/1/allblogs");
            return response.data.blogs;
        }

        if (location.pathname === "/blogs/my-blogs" && userInfo._id) {
            const response = await axiosSecure.get(`/blogs/${userInfo._id}/users`);
            return response.data.blogs;
        }

        return []; // Default return value if no condition matches
    };

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs', location.pathname, userInfo._id],
        queryFn: fetchBlogs,
        enabled: !!userInfo._id || location.pathname === "/blogs/explore",
    });

    const deleteBlogMutation = useMutation({
        mutationFn: (blogid) => axiosSecure.delete(`/blogs/${blogid}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['blogs', location.pathname, userInfo._id]);
            notifySuccess("Blog deleted successfully");
        },
        onError: () => {
            notifyError("Failed to delete blog");
        },
    });

    const handleDelete = (blogid) => {
        deleteBlogMutation.mutate(blogid);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100dvh-200px)]">
                <p className="text-2xl font-bold">No blogs to show</p>
            </div>
        );
    }

    return (
        <div className="min-h-dvh">
            <div className="grid grid-cols-2 gap-5 mt-10">
                {blogs.map((blog) => (
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
                ))}
            </div>
        </div>
    );
};

export default AllBlogsCards;
