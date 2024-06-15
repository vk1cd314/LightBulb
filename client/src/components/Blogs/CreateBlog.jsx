import { useState } from "react";
import Tiptap from "../TipTap/TipTap";
import katex from "katex";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";

const CreateBlog = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(""); // State to hold rendered HTML preview
    const [tikzPicture, setTikzPicture] = useState(""); // State to hold TikZ pictures

    // Custom Axios instance for secure requests
    const axiosSecure = useAxiosSecure();

    // Function to render LaTeX expressions to HTML using KaTeX
    const renderLatex = (latex) => {
        const inlineLatexRegex = /\$(.*?)\$/g;
        const displayLatexRegex = /\$\$(.*?)\$\$/g;

        let html = latex.replace(inlineLatexRegex, (match, latexExpression) => {
            return katex.renderToString(latexExpression, {
                throwOnError: false,
                displayMode: false,
            });
        });

        html = html.replace(displayLatexRegex, (match, latexExpression) => {
            return katex.renderToString(latexExpression, {
                throwOnError: false,
                displayMode: true,
            });
        });

        return html;
    };

    // Function to handle preview button click
    const handlePreview = () => {
        setPreview(renderLatex(content)); // Render LaTeX content to HTML and set to preview state
        
        const tikzPictureRegex = /\\begin{tikzpicture}(.*?)\\end{tikzpicture}/gs;
        const tikzPictures = content.match(tikzPictureRegex);

        setTikzPicture(tikzPictures); // Set TikZ pictures state for reference

        // Assuming there's at least one TikZ picture in the content
        if (tikzPictures && tikzPictures.length > 0) {
            axiosSecure.post("/blogs/generate", { "tikz_code": tikzPictures[0].toString() })
                .then((response) => {
                    const base64Image = response.data.base64_image;
                    console.log(base64Image)

                    // Set the preview state to display the image
                    setPreview(`<img src="data:image/png;base64,${base64Image}" />`);
                })
                .catch((error) => {
                    console.error('Error fetching image:', error);
                });
        }
    };

    const handlePublish = () => {
        // Publish logic here (not implemented in this example)
        console.log(content);
    };

    return (
        <div className="min-h-dvh mt-32 max-w-5xl mx-auto">
            <div className="flex gap-10 items-center">
                <p className="text-2xl font-bold">Title:</p>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <Tiptap setContent={setContent} content={content} />
            <div className="mt-10 text-end">
                <button
                    className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full mr-5"
                    onClick={handlePreview}
                >
                    Preview
                </button>
                <button
                    className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full"
                    onClick={handlePublish}
                >
                    Publish
                </button>
            </div>

            <p className="font-bold text-xl mt-10">Raw:</p>
            <p className="max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20">{content}</p>
            <p className="font-bold text-xl mt-10">Preview:</p>
            <div className="prose max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20" dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
    );
};

export default CreateBlog;
