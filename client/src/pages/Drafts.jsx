import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";
import { MessageContext } from "./Root";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/FunctionalComponents/Loader";

const Drafts = () => {
    const axiosSecure = useAxiosSecure();
    const { userInfo, loading } = useContext(AuthContext);
    const { notifySuccess, notifyError } = useContext(MessageContext);

    const queryClient = useQueryClient();

    const { data: drafts, isLoading } = useQuery({
        queryKey: ["drafts", userInfo._id],
        queryFn: () =>
            axiosSecure
                .get(`/drafts/${userInfo._id}/drafts`)
                .then((res) => res.data),
        enabled: !!userInfo._id,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/drafts/${id}`),
        onSuccess: () => {
            notifySuccess("Draft deleted successfully");
            queryClient.invalidateQueries(["drafts", userInfo._id]);
        },
        onError: () => {
            notifyError("Failed to delete draft");
        },
    });

    if (isLoading || loading) {
        return <Loader />;
    }

    if (drafts.length === 0) {
        return (
            <div className="text-center mt-20 min-h-[calc(100dvh-200px)] flex flex-col justify-center items-center">
                <p className="text-2xl font-bold">No drafts found</p>
                <Link
                    to="/blog/create"
                    className="hover:bg-accent bg-primary text-white p-2 rounded-lg mt-5"
                >
                    Create a new blog
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-20 max-w-3xl mx-auto min-h-dvh">
            <table className="w-full text-center border-collapse border-2 border-gray-500">
                <thead>
                    <tr>
                        <th className="border-2 border-gray-500">Title</th>
                        <th className="border-2 border-gray-500">Created At</th>
                        <th className="border-2 border-gray-500">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {drafts &&
                        drafts.map((draft) => (
                            <tr key={draft._id}>
                                <td className="border-2 border-gray-500 underline underline-offset-4 p-2">
                                    <Link to={`/drafts/${draft._id}/edit`}>
                                        {draft.title}
                                    </Link>
                                </td>
                                <td className="border-2 border-gray-500 p-2">
                                    {draft.created_at}
                                </td>
                                <td className="border-2 border-gray-500 p-2">
                                    <button
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                        onClick={() =>
                                            deleteMutation.mutate(draft._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Drafts;
