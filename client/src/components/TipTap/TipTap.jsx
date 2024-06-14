import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import PropTypes from "prop-types";
import {
    FaAlignCenter,
    FaAlignJustify,
    FaAlignLeft,
    FaAlignRight,
    FaBold,
    FaCode,
    FaItalic,
    FaParagraph,
    FaStrikethrough,
    FaUnderline,
} from "react-icons/fa6";
import {
    MdFormatClear,
    MdFormatListBulleted,
    MdHorizontalRule,
    MdOutlineClearAll,
} from "react-icons/md";
import {
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuHeading4,
    LuHeading5,
    LuHeading6,
} from "react-icons/lu";
import { RiListOrdered } from "react-icons/ri";
import { AiOutlineCode } from "react-icons/ai";
import { BsBlockquoteLeft } from "react-icons/bs";
import { CgArrowsBreakeV } from "react-icons/cg";
import { FaRedo, FaUndo } from "react-icons/fa";

import "./TipTap.css";
import "katex/dist/katex.min.css";
import MathExtension from "@aarkue/tiptap-math-extension";

const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap my-5">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
                title="Bold"
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
                title="Strike"
            >
                <FaStrikethrough />
            </button>
            {/* text alignment */}
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                className={
                    editor.isActive("textAlign", { align: "left" })
                        ? "is-active"
                        : ""
                }
                title="Left Align"
            >
                <FaAlignLeft />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                className={
                    editor.isActive("textAlign", { align: "center" })
                        ? "is-active"
                        : ""
                }
                title="Center Align"
            >
                <FaAlignCenter />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                className={
                    editor.isActive("textAlign", { align: "right" })
                        ? "is-active"
                        : ""
                }
                title="Right Align"
            >
                <FaAlignRight />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                }
                className={
                    editor.isActive("textAlign", "justify") ? "is-active" : ""
                }
                title="Justify"
            >
                <FaAlignJustify />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "is-active" : ""}
                title="Code"
            >
                <FaCode />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "is-active" : ""}
                title="Underline"
            >
                <FaUnderline />
            </button>
            <button
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                title="Clear formatting"
            >
                <MdFormatClear />
            </button>
            <button
                onClick={() => editor.chain().focus().clearNodes().run()}
                title="Clear Node"
            >
                <MdOutlineClearAll />
            </button>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive("paragraph") ? "is-active" : ""}
                title="Paragraph"
            >
                <FaParagraph />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                    editor.isActive("heading", { level: 1 }) ? "is-active" : ""
                }
                title="Heading 1"
            >
                <LuHeading1 />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                    editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                }
                title="Heading 2"
            >
                <LuHeading2 />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                    editor.isActive("heading", { level: 3 }) ? "is-active" : ""
                }
                title="Heading 3"
            >
                <LuHeading3 />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={
                    editor.isActive("heading", { level: 4 }) ? "is-active" : ""
                }
                title="Heading 4"
            >
                <LuHeading4 />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                className={
                    editor.isActive("heading", { level: 5 }) ? "is-active" : ""
                }
                title="Heading 5"
            >
                <LuHeading5 />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                className={
                    editor.isActive("heading", { level: 6 }) ? "is-active" : ""
                }
                title="Heading 6"
            >
                <LuHeading6 />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
                title="Bullet List"
            >
                <MdFormatListBulleted />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
                title="Ordered List"
            >
                <RiListOrdered />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "is-active" : ""}
                title="Code Block"
            >
                <AiOutlineCode />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "is-active" : ""}
                title="Blockquote"
            >
                <BsBlockquoteLeft />
            </button>
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <MdHorizontalRule />
            </button>
            <button
                onClick={() => editor.chain().focus().setHardBreak().run()}
                title="Line Break"
            >
                <CgArrowsBreakeV />
            </button>
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="Undo"
            >
                <FaUndo />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="Redo"
            >
                <FaRedo />
            </button>
            
        </div>
    );
};

// define your extension array
const extensions = [
    StarterKit,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
    Underline,
    MathExtension.configure({ evaluation: true }),
];

const Tiptap = ({ setContent, content }) => {
    return (
        <div className="prose min-w-full tiptap">
            <EditorProvider
                slotBefore={<MenuBar />}
                extensions={extensions}
                content={content}
                onUpdate={({ editor }) => {
                    setContent(editor.getHTML()); // Extract text content and call setContent
                }}
            ></EditorProvider>
        </div>
    );
};

Tiptap.propTypes = {
    setContent: PropTypes.func.isRequired,
    content: PropTypes.string,
};

export default Tiptap;
