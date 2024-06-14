import { BiComment } from "react-icons/bi";
import { FaThumbsUp } from "react-icons/fa6";
import CommentBox from '../components/Shared/CommentBox';

const BlogPage = () => {
    const content = `<h1>This is america</h1><p style="text-align: right">Welcome to the city of angels</p><p style="text-align: center"><u>Hehehe</u></p><p><code>huhuhu</code> </p><pre><code>hihi
    </code></pre><p></p> <p><strong>huhuhu</strong></p><p><em>huhuhu</em></p><p><del>huhuhu</del></p><p><a href="https://www.google.com">Google</a></p><p><img src="https://randomuser.me/api/portraits`;
    return (
        <>
            <div>
                <h1 className="text-4xl font-bold text-center mt-20">
                    Blog Title
                </h1>
                <div className="flex justify-center my-5">
                    <img
                        className="rounded-full size-8"
                        src="https://randomuser.me/api/portraits"
                    />
                    <div className="ml-3">
                        <h1 className="font-bold">John Doe</h1>
                        <p className="text-gray-500">2 hours ago</p>
                    </div>
                </div>
            </div>
            <div className="min-h-dvh max-w-5xl mx-auto">
                <hr className="my-5 border border-gray-300" />
                <div
                    className="prose max-w-5xl p-5 "
                    dangerouslySetInnerHTML={{ __html: content }}
                ></div>
                <hr className="my-5 border border-gray-300" />
                {/* like, comment count */}
                <div className="flex gap-10">
                    <div className="flex items-center">
                        <BiComment className="mr-1" />
                        <p>12</p>
                    </div>
                    <div className="flex items-center">
                        <FaThumbsUp className="mr-1" />
                        <p>3</p>
                    </div>
                </div>
                {/* all comments */}
                <h1 className="font-bold text-2xl my-10">Comments</h1>
                <CommentBox />
                <CommentBox />
                <CommentBox />
            </div>
        </>
    );
};

export default BlogPage;
