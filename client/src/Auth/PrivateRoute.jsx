import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/FunctionalComponents/Loader";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (user) {
        return children;
    }

    return loading ? (
        <Loader />
    ) : (
        <Navigate state={location.pathname} to="/login" />
    );
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
