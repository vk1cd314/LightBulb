import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import auth from "./firebase.init";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // State to keep track of the current user
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState({});

    // Function to create a new user
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Function to log out the current user
    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Function to log in the user
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    //update user profile
    const updateUserProfile = (user, name, url) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: url,
        });
    };

    // Effect to run when the component mounts
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const googleProvider = new GoogleAuthProvider();

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };


    // Object to be passed as value to the context
    const authInfo = {
        user,
        createUser,
        loading,
        logout,
        login,
        updateUserProfile,
        googleLogin,
        setLoading,
        userInfo,
        setUserInfo,
    };

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export { AuthContext };
export default AuthProvider;
