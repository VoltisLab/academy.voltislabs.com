import dynamic from 'next/dynamic';
import React from 'react'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <p>Loading editor...</p>
  });
  
  // Define the toolbar modules for React Quill
  const quillModules = {
    toolbar: {
      container: "#custom-toolbar",
    },
  };
  
  const quillFormats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "link", "image", "code-block"
  ];

  type ChildProps = {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    setHtmlMode: React.Dispatch<React.SetStateAction<boolean>>;
    htmlMode: boolean
  };
  

const Article = ({htmlMode, content, setContent, setHtmlMode}: ChildProps) => {
    return (
        <div className="border border-gray-300 rounded-md p-4">
{/* Heading */}
<h3 className="text-sm font-semibold text-gray-800 mb-2">Text</h3>

{/* Editor Container with pink ring */}
<div className="focus-within:ring-2 focus-within:ring-[#EC4899] rounded-md transition-all duration-200 border border-gray-300">
  
  {/* Custom toolbar container */}
  <div className="flex justify-between items-center flex-nowrap w-full px-2 py-1 bg-white border-b border-gray-200" id="custom-toolbar">

    
    {/* Quill formatting buttons */}
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <select className="ql-header outline-none border-none bg-transparent" defaultValue="">
        <option value="">Styles</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-code-block" />
    </div>

    {/* Edit HTML toggle button */}
    <div className="shrink-0">
<button
  onClick={() => setHtmlMode(!htmlMode)}
  className="text-xs font-medium text-gray-800 hover:bg-gray-100 rounded px-3 py-1 whitespace-nowrap"
>
  {htmlMode ? "Live Preview" : "Edit HTML"}
</button>
</div>

  </div>

  {/* Editor Body */}
  <div
    className={`h-[66px] px-2 transition-all ${
      htmlMode ? "bg-[#1A1B1F]" : "bg-white"
    }`}
  >
    <ReactQuill
      value={content}
      onChange={setContent}
      modules={{ toolbar: "#custom-toolbar" }}
      formats={quillFormats}
      theme="snow"
      placeholder="Start writing your article content here..."
      className={`h-full [&_.ql-editor]:h-full [&_.ql-editor]:p-2 [&_.ql-toolbar]:!border-0 [&_.ql-container]:!border-0 [&_.ql-toolbar_.ql-formats>*]:!border-0 [&_.ql-toolbar_.ql-formats>*]:!shadow-none ${
        htmlMode
          ? "!text-white [&_.ql-editor]:text-white [&_.ql-editor]:bg-[#1A1B1F]"
          : ""
      }`}
    />
  </div>
</div>

{/* Save Button */}
<div className="flex justify-end pt-4">
  <button className="bg-[#6D28D2] text-white text-sm px-4 py-2 rounded hover:bg-[#5b21b6] transition">
    Save
  </button>
</div>
</div>

      
      );
}

export default Article