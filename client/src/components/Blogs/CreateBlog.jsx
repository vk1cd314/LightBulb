import { useState } from "react";
import Tiptap from "../TipTap/TipTap";
import katex from "katex";

const CreateBlog = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    const handlePublish = () => {
        // publish to db
        console.log(content);
    };

    // Convert LaTeX to HTML using katex
    const renderLatex = (latex) => {
        // Regular expression to match inline LaTeX expressions
        const inlineLatexRegex = /\$(.*?)\$/g;

        // Regular expression to match display mode LaTeX expressions
        const displayLatexRegex = /\$\$(.*?)\$\$/g;

        // Replace inline LaTeX expressions with their HTML equivalents
        let html = latex.replace(inlineLatexRegex, (match, latexExpression) => {
            return katex.renderToString(latexExpression, {
                throwOnError: false,
                displayMode: false,
            });
        });

        // Replace display mode LaTeX expressions with their HTML equivalents
        html = html.replace(displayLatexRegex, (match, latexExpression) => {
            return katex.renderToString(latexExpression, {
                throwOnError: false,
                displayMode: true,
            });
        });

        return html;
    };

    return (
        <div className="min-h-dvh mt-32 max-w-5xl mx-auto">
            {/* blog title input */}
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
                    className="px-3 py-2 bg-accent text-white font-bold w-fit rounded-full"
                    onClick={handlePublish}
                >
                    Publish
                </button>
            </div>

            <p className="font-bold text-xl mt-10">Raw:</p>
            <p
                className="max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20"
            >{content}</p>
            <p className="font-bold text-xl mt-10">Preview:</p>
            <div
                className="prose max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20"
                dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
            />
        </div>
    );
};

export default CreateBlog;
