import { useLocation } from "react-router-dom";
import HeaderCard from "../Shared/HeaderCard";
import { useEffect,  } from "react";

const AllBlogsCards = () => {
    const location = useLocation();
    // const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (location.pathname === "/blogs/explore") {
            // fetch blogs
        }

        if (location.pathname === "/blogs/my-blogs") {
            // fetch user blogs
        }
    }, [location]);
    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            <HeaderCard/>
            <HeaderCard/>
            <HeaderCard/>
        </div>
    );
};

export default AllBlogsCards;