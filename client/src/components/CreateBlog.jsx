import { useState } from "react";
import TipTapEditor from "./TipTap/TipTap";

const CreateBlog = () => {
    const [content, setContent] = useState("");
    return (
        <div className="min-h-dvh mt-32 max-w-5xl mx-auto">
           <TipTapEditor />
        </div>
    );
};

export default CreateBlog;