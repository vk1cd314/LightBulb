import { useContext, useState } from "react";
import Tiptap from "../TipTap/TipTap";
import katex from "katex";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router-dom/dist";

const CreateBlog = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(""); // State to hold rendered HTML preview
    const { userInfo } = useContext(AuthContext);

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

    const handlePreview = (callback) => {
        const tikzPictureRegex = /\\begin{tikzpicture}[\s\S]*?\\end{tikzpicture}/g;
        const tikzPictures = content.match(tikzPictureRegex);
        console.log(tikzPictures);
    
        let updatedContent = content;
        const base64Images = new Array(tikzPictures ? tikzPictures.length : 0);
    
        if (tikzPictures && tikzPictures.length > 0) {
            let processedCount = 0;
    
            tikzPictures.forEach((tikzPicture, index) => {
                axiosSecure
                    .post("/blogs/generate", {
                        tikz_code: tikzPicture.toString(),
                    })
                    .then((response) => {
                        const base64Image = response.data.base64_image;
                        base64Images[index] = base64Image;
                        processedCount++;
    
                        // If all images have been processed, perform the replacement
                        if (processedCount === tikzPictures.length) {
                            base64Images.forEach((image, i) => {
                                updatedContent = updatedContent.replace(
                                    tikzPictures[i],
                                    `<img src="data:image/png;base64,${image}" />`
                                );
                            });
    
                            // Set the preview state to display the updated content
                            setPreview(renderLatex(updatedContent));
                            callback();
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching image:", error);
                        processedCount++;
    
                        // If all images have been processed, even with errors, perform the replacement
                        if (processedCount === tikzPictures.length) {
                            base64Images.forEach((image, i) => {
                                updatedContent = updatedContent.replace(
                                    tikzPictures[i],
                                    `<img src="data:image/png;base64,${image || ''}" />`
                                );
                            });
    
                            // Set the preview state to display the updated content
                            setPreview(renderLatex(updatedContent));
                            callback();
                        }
                    });
            });
        } else {
            setPreview(renderLatex(content));
            callback();
        }
    };
    

    const location = useLocation();
    const navigate = useNavigate();

    const handlePublish = () => {
        handlePreview(() => {
            if (location.pathname === "/blog/create"){
                const newBlog = {
                    title: title,
                    content: preview,
                    uid: userInfo._id,
                    created_at: new Date().toLocaleString(),
                };
    
                axiosSecure.post("/blogs", newBlog).then((response) => {
                    console.log(response.data);
                    navigate(`/b/${response.data._id}`);
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
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
            <p className="max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20">
                {content}
            </p>
            <p className="font-bold text-xl mt-10">Preview:</p>
            <div
                className="prose max-w-5xl p-5 border-2 border-gray-200 w-full rounded-lg mt-5 mb-20"
                dangerouslySetInnerHTML={{ __html: preview }}
            />
        </div>
    );
};

export default CreateBlog;
