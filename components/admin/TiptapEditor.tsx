"use client";

import React, { useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, LinkIcon, ImageIcon,
  Undo, Redo, Minus, Upload, Loader2,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick, isActive = false, disabled = false, title, children,
}: {
  onClick: () => void; isActive?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`p-1.5 rounded text-[11px] transition-colors ${
        isActive ? "bg-emerald-900 text-amber-400 shadow-xs" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >{children}</button>
  );
}

function Divider() { return <div className="w-px h-5 bg-slate-200 mx-0.5" />; }

export default function TiptapEditor({
  content, onChange, placeholder = "Tulis konten di sini...", minHeight = "min-h-[180px]",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: "text-emerald-800 underline hover:text-emerald-900" } }),
      Placeholder.configure({ placeholder }),
      TiptapImage.configure({ HTMLAttributes: { class: "max-w-full h-auto rounded-lg border border-slate-200 my-2" } }),
    ],
    content,
    onUpdate: ({ editor: e }) => { onChange(e.getHTML()); },
    editorProps: {
      attributes: {
        class: `prose prose-sm prose-slate max-w-none focus:outline-none px-4 py-3 ${minHeight} [&_.ProseMirror]:outline-none`,
      },
    },
  });

  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Masukkan URL:", editor.getAttributes("link").href || "");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Masukkan URL gambar:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const uploadImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success && json.url) {
        editor.chain().focus().setImage({ src: json.url }).run();
      } else {
        alert(json.error || "Upload gambar gagal");
      }
    } catch {
      alert("Upload gambar gagal. Pastikan server berjalan.");
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Urungkan">
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Ulangi">
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Tebal">
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Miring">
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Coret">
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Kode">
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Judul 1">
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Judul 2">
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="Judul 3">
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Daftar Tak Berurut">
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Daftar Berurut">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Kutipan">
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah">
          <Minus className="w-3.5 h-3.5" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={setLink} isActive={editor.isActive("link")} title="Tautan">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} disabled={isUploading} title="Unggah Gambar dari Komputer">
          {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Gambar dari URL">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={uploadImage} className="hidden" />
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
