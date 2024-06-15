const ReplyBox = () => {
    return (
        <div>
            <p className="ml-2 my-2 font-medium">John Doe</p>
            <div className="flex gap-5">
            
                <img className="rounded-full size-8" src="https://randomuser.me/api/portraits" />
                <p className="w-full p-2 border-t border-gray-300 rounded-lg" >Great post!</p>
            </div>
        </div>
    );
};

const CommentBox = () => {
    return (
        <div className="mt-10 w-full border-2 border-gray-300 p-3 rounded-2xl flex gap-5">
            <img
                className="rounded-full size-8"
                src="https://randomuser.me/api/portraits"
            />
            <div className="w-full">
                <div>
                    <h1 className="font-bold">John Doe</h1>
                    <p>2 hours ago</p>
                </div>
                <hr className="my-5 border border-gray-300" />
                <p>Great post!</p>
                {/* Replies */}
                <h2 className="font-bold text-lg my-5">Replies</h2>
                {/* reply button */}
                <div className="flex gap-5">
                    <img
                        className="rounded-full size-8"
                        src="https://randomuser.me/api/portraits"
                    />
                    <textarea
                        type="text"
                        placeholder="Reply"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    </div>
                <div className="space-y-4 my-4 ml-10">
                    <ReplyBox />
                    <ReplyBox />
                    <ReplyBox />
                </div>
            </div>
        </div>
    );
};

export default CommentBox;
