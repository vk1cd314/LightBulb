import { useState } from "react";
import Tiptap from "./TipTap/TipTap";

const CreateBlog = () => {
    const [content, setContent] = useState("");

    const handlePublish = () => {
        // publish to db
        console.log(content);
    };

    return (
        <div className="min-h-dvh mt-32 max-w-5xl mx-auto">
            <Tiptap setContent={setContent} />
            <div className="mt-10 text-end">
                <button className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full" onClick={handlePublish}>Publish</button>
            </div>

            <p className="font-bold text-xl my-10">Preview:</p>
            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default CreateBlog;
