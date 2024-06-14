import { useState } from "react";
import Tiptap from "../TipTap/TipTap";

const CreateBlog = () => {
    const [content, setContent] = useState("");
    const [, setTitle] = useState("");

    const handlePublish = () => {
        // publish to db
        console.log(content);
    };

    return (
        <div className="min-h-dvh mt-32 max-w-5xl mx-auto">
            {/* blog title input */}
            <div className="flex gap-10 items-center">
                <p className="text-2xl font-bold">Title:</p>
                <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <Tiptap setContent={setContent} />
            <div className="mt-10 text-end">
                <button className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full" onClick={handlePublish}>Publish</button>
            </div>

            <p className="font-bold text-xl my-10">Preview:</p>
            <div
                className="prose max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default CreateBlog;
