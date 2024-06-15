import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
// import { MessageContext } from "./Root";

const Settings = () => {
    const { user } = useContext(AuthContext);
    // const { notifySuccess, notifyError } = useContext(MessageContext); //use to notify user of success or error
    const handleSubmit = (e) => {
        e.preventDefault();
        //get form details
        const formData = new FormData(e.target);
        const displayName = formData.get("displayName");
        const gender = formData.get("gender");
        const about = formData.get("about");
        console.log(displayName, gender, about);

        //reset form
        e.target.reset();
    };

    return (
        <div className="h-dvh flex items-center max-w-5xl mx-auto ">
            <form onSubmit={handleSubmit} className="space-y-4 flex justify-center flex-col">
                <div className="flex gap-20">
                    <div className="flex flex-col space-y-4">
                        <p className="text-xl font-bold">Email Addres</p>
                        <p className="text-lg px-3 py-2 bg-gray-200 w-fit rounded-lg">
                            {user?.email}
                        </p>
                        {/* gender */}
                        <div className="space-y-2">
                            <p className="text-xl font-bold">Gender</p>
                            <p className="text-sm">
                                This information may be used to improve your
                                recommendations and ads.
                            </p>
                            <select
                                className="border border-gray-200 px-3 py-2 rounded-lg"
                                name="gender"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select your gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold">Display Name</p>
                            <p className="text-sm">
                                Set a display name. This does not change your username.
                            </p>
                            <input
                                type="text"
                                name="displayName"
                                defaultValue={user?.displayName}
                                className="border border-gray-200 px-3 py-2 rounded-lg max-w-72"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold">username</p>
                            <p className="text-sm">
                                Set a username. This is unique to you.
                            </p>
                            <input
                                type="text"
                                name="username"
                                defaultValue={user?.displayName}
                                className="border border-gray-200 px-3 py-2 rounded-lg max-w-72"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        {/* set profile picture */}
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src={user?.photoURL}
                                alt="profile"
                                className="rounded-full w-32 h-32"
                            />
                            {/* take direct image url for profile picture */}
                            <input
                                type="text"
                                name="profilePicture"
                                placeholder="https://i.ibb.co/your-image-url.jpg"
                                className="border border-gray-200 px-3 py-2 rounded-lg w-full  mt-5"
                            />
                        </div>
                        <p className="text-xl font-bold">About</p>
                        <p className="text-sm">
                            A brief description of yourself shown on your profile.
                        </p>
                        <textarea
                            type="text"
                            name="about"
                            placeholder="About you"
                            className="border border-gray-200 px-3 py-2 rounded-lg min-w-[450px]"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-black text-white px-10 py-2 rounded-lg w-fit mx-auto hover:bg-accent"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default Settings;
