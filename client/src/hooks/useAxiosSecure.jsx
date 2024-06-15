import axios from "axios";
import { useEffect } from "react";



const axiosSecure = axios.create({
    baseURL: 'http://localhost:8000',
});

const useAxiosSecure = () => {

    useEffect(() => {
        axiosSecure.interceptors.response.use(res => {
            return res;
        }, error => {
            console.log('error tracked in the interceptor', error.response)
        })
    }, [])

    return axiosSecure;
};

export default useAxiosSecure;