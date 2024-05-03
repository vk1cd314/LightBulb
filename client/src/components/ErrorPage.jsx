import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="h-dvh w-dvw flex flex-col justify-center items-center text-center space-y-5">
            <img
                className="h-2/3"
                src="https://i.ibb.co/C7X1ybF/mark-error.png"
                alt=""
            />
            <h1 className="font-extrabold text-5xl">
                Oh no... We lost this page
            </h1>
            <p>
                We searched everywhere but couldn’t find what you’re looking
                for. <br /> Let’s find a better place for you to go.
            </p>
            <Link to="/">
                <button className="text-white px-5 py-3 bg-primary hover:bg-transparent hover:text-black font-medium text-2xl rounded-lg border-2 border-transparent hover:border-primary">
                    Go back to home
                </button>
            </Link>
        </div>
    );
};

export default ErrorPage;
