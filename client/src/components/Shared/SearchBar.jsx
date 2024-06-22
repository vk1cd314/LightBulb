import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const SearchBar = () => {
    const axiosSecure = useAxiosSecure();
    const [searchParam, setSearchParam] = useState("");
    const searchRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const isProfileSearch = location.pathname.includes("/profile");

    const { data: searchResults, refetch } = useQuery({
        queryKey: ["search", searchParam, isProfileSearch],
        queryFn: () => {
            if (searchParam.trim() === "") return { blogs: [], users: [] };
            if (isProfileSearch) {
                return axiosSecure
                    .get(`/users/search/${searchParam}`)
                    .then((response) => ({ users: response.data, blogs: [] }));
            } else {
                return axiosSecure
                    .get(`/blogs/search/${searchParam}`)
                    .then((response) => ({ blogs: response.data, users: [] }));
            }
        },
        enabled: false,
    });

    const handleSearch = () => {
        if (searchParam.trim() !== "") {
            refetch();
            setIsDropdownOpen(true);
        }
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
        <div
            className="flex justify-center lg:flex-row items-center gap-4 relative"
            ref={searchRef}
        >
            <input
                type="text"
                placeholder={isProfileSearch ? "Search users" : "Search blogs"}
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
            {isDropdownOpen && searchResults && (
                <div className="absolute flex flex-col border border-gray-300 top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2">
                    {searchResults.blogs &&
                        searchResults.blogs.map((result) => (
                            <Link
                                to={`/b/${result._id}`}
                                key={result._id}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                {result.title}
                                <hr />
                            </Link>
                        ))}
                    {searchResults.users &&
                        searchResults.users.map((result) => (
                            <Link
                                to={`/profile/${result._id}`}
                                key={result._id}
                                className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                            >
                                <img
                                    src={result.profilepic}
                                    className="rounded-full size-12"
                                    alt={result.name}
                                />
                                {result.name}
                                <hr />
                            </Link>
                        ))}
                    {(!searchResults.blogs ||
                        searchResults.blogs.length === 0) &&
                        (!searchResults.users ||
                            searchResults.users.length === 0) && (
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
