import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const SearchBar = () => {
    const axiosSecure = useAxiosSecure();
    const [searchParam, setSearchParam] = useState("");
    const searchRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = () => {
        axiosSecure.get(`/blogs/search/${searchParam}`).then((response) => {
            setSearchResults(response.data);
            setIsDropdownOpen(true);
        });
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-center lg:flex-row items-center gap-4 relative" ref={searchRef}>
            <input
                type="text"
                placeholder="Search Blogs"
                className="p-2 rounded-lg bg-gray-100 text-primary border-2 border-primary"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
            />
            <button
                className="p-3 rounded-full bg-primary text-gray-50"
                onClick={handleSearch}
            >
                <IoSearchOutline />
            </button>
            {isDropdownOpen && (
                <div className="absolute flex flex-col border border-gray-300 top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <>
                                <Link to={`/b/${result._id}`} key={result._id} className="p-2 hover:bg-gray-100 rounded-lg">
                                    {result.title}
                                
                                </Link>
                                <hr />
                            </>
                        ))
                    ) : (
                        <div className="p-2">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    setAllProducts: PropTypes.func,
    setLoading: PropTypes.func,
};

export default SearchBar;
