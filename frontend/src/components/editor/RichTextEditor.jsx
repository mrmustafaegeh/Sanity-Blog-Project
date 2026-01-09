// frontend/src/components/editor/RichTextEditor.jsx
import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Quote,
  Type,
} from "lucide-react";
import { toast } from "react-toastify";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing your post...",
  height = "400px",
}) {
  const editorRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.target.innerHTML);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  const handleFormat = (command) => {
    try {
      execCommand(command);
    } catch (error) {
      toast.error("Formatting error");
    }
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      toast.info("Select text to add a link");
      return;
    }

    setSelectedText(selection.toString());
    setLinkText(selection.toString());
    setIsLinkModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = `<img src="${event.target.result}" alt="Uploaded image" class="max-w-full h-auto rounded-lg" />`;
      execCommand("insertHTML", img);
      toast.success("Image added successfully");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertLink = () => {
    if (!linkUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 underline">${linkText || linkUrl}</a>`;
    execCommand("insertHTML", link);

    setIsLinkModalOpen(false);
    setLinkUrl("");
    setLinkText("");
    toast.success("Link added successfully");
  };

  const toolbarButtons = [
    { command: "bold", icon: <Bold size={16} />, tooltip: "Bold (Ctrl+B)" },
    {
      command: "italic",
      icon: <Italic size={16} />,
      tooltip: "Italic (Ctrl+I)",
    },
    { separator: true },
    {
      command: "formatBlock",
      value: "<h1>",
      icon: <Heading1 size={16} />,
      tooltip: "Heading 1",
    },
    {
      command: "formatBlock",
      value: "<h2>",
      icon: <Heading2 size={16} />,
      tooltip: "Heading 2",
    },
    { separator: true },
    {
      command: "insertUnorderedList",
      icon: <List size={16} />,
      tooltip: "Bullet List",
    },
    {
      command: "insertOrderedList",
      icon: <ListOrdered size={16} />,
      tooltip: "Numbered List",
    },
    { separator: true },
    { action: "link", icon: <Link size={16} />, tooltip: "Insert Link" },
    { separator: true },
    {
      command: "formatBlock",
      value: "<blockquote>",
      icon: <Quote size={16} />,
      tooltip: "Quote",
    },
    {
      command: "formatBlock",
      value: "<pre>",
      icon: <Code size={16} />,
      tooltip: "Code Block",
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 px-4 py-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((btn, index) => {
          if (btn.separator) {
            return (
              <div key={`sep-${index}`} className="w-px h-6 bg-gray-300 mx-1" />
            );
          }

          if (btn.action === "link") {
            return (
              <button
                key="link"
                type="button"
                onClick={handleLink}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title={btn.tooltip}
              >
                {btn.icon}
              </button>
            );
          }

          return (
            <button
              key={btn.command}
              type="button"
              onClick={() => handleFormat(btn.command, btn.value)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title={btn.tooltip}
            >
              {btn.icon}
            </button>
          );
        })}

        {/* Image Upload */}
        <label className="p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Image size={16} />
        </label>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] focus:outline-none prose prose-lg max-w-none"
        style={{ height }}
        data-placeholder={placeholder}
        onFocus={(e) => {
          if (e.target.innerHTML === "") {
            e.target.innerHTML = "";
          }
        }}
        onBlur={(e) => {
          if (e.target.innerHTML === "") {
            e.target.innerHTML = "";
          }
        }}
      />

      {/* Character Count */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <span>{value.replace(/<[^>]*>/g, "").length} characters</span>
        <span>
          {Math.ceil(value.replace(/<[^>]*>/g, "").length / 5 / 238)} min read
        </span>
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Insert Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Link text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
