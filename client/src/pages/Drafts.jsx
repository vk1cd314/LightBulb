import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";

const Drafts = () => {
    const axiosSecure = useAxiosSecure();
    const [drafts, setDrafts] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const { userInfo, loading } = useContext(AuthContext);

    useEffect(() => {
        if (!loading) {
            setIsLoading(true);
            axiosSecure
                .get(`/drafts/${userInfo._id}/drafts`)
                .then((response) => {
                    console.log(response.data);
                    setDrafts(response.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, []);

    if (isloading || loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
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
                    </tr>
                </thead>
                <tbody>
                    {drafts.map((draft) => (
                        <tr key={draft._id}>
                            <td className="border-2 border-gray-500 underline underline-offset-4 p-2">
                                <Link to={`/drafts/${draft._id}/edit`}>
                                    {draft.title}
                                </Link>
                            </td>
                            <td className="border-2 border-gray-500 p-2">
                                {draft.created_at}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Drafts;
