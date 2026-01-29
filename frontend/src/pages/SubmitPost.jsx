// frontend/src/pages/SubmitPost.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubmitPostMutation, useUploadImageMutation } from "../api/submissionsAPI";
import RichTextEditor from "../components/editor/RichTextEditor";
import CategorySelect from "../components/editor/CategorySelect";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import clsx from "clsx";
import { AlertCircle, FileText, Image as ImageIcon, X, Loader2 } from "lucide-react";

export default function SubmitPost() {
  const navigate = useNavigate();
  const [submitPost, { isLoading }] = useSubmitPostMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    categories: [],
    tags: [],
    featuredImage: "",
  });
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  // Debug user info
  useEffect(() => {
    console.log("🔍 User for submission:", user);
  }, [user]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (selectedCategories) => {
    setFormData({
      ...formData,
      categories: selectedCategories,
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData({
      ...formData,
      tags,
    });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(formData).unwrap();
      setFormData((prev) => ({
        ...prev,
        featuredImage: result.url,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (formData.title.length < 10)
      newErrors.title = "Title must be at least 10 characters";
    if (content.length < 100)
      newErrors.content = "Content must be at least 100 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Get userId - your backend expects 'userId' field
      const userId = user?._id || user?.id;

      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      console.log("🚀 Submitting with userId:", userId);

      // Transform categories for MongoDB (not Sanity references)
      const categoriesForSubmission = formData.categories.map((category) => {
        if (typeof category === "string") {
          return category;
        }
        // If it's an object, extract the ID
        return {
          _type: category._type || "reference",
          _ref: category._id || category._ref || category,
        };
      });

      const submissionData = {
        userId: userId,
        title: formData.title,
        excerpt: formData.excerpt || "",
        content: content,
        tags: formData.tags || [],
        featuredImage: formData.featuredImage || "",
        categories: categoriesForSubmission,
        difficulty: "beginner",
        readingTime: Math.ceil(content.split(" ").length / 200) || 5,
      };

      console.log(
        "📤 Submission data:",
        JSON.stringify(submissionData, null, 2)
      );

      const result = await submitPost(submissionData).unwrap();

      console.log("✅ Submission successful:", result);

      toast.success("Post submitted for review!");
      navigate("/user/submissions");
    } catch (error) {
      console.error("❌ Submission error:", error);
      toast.error(
        error?.data?.message || error?.message || "Submission failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
            Submit a Post
          </h1>
          <p className="text-secondary text-lg">
            Share your knowledge with the community.
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={clsx(
                   "w-full px-4 py-3 bg-neutral-50 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary",
                   errors.title ? "border-destructive focus:ring-destructive" : "border-border"
                )}
                placeholder="Enter a compelling title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Featured Image
              </label>
              
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                {formData.featuredImage ? (
                  <div className="relative group">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured preview" 
                      className="w-full h-64 object-cover rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button 
                        type="button" 
                        variant="danger" 
                        size="small"
                        onClick={removeImage}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center cursor-pointer text-center py-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                        <p className="text-sm text-primary font-medium">Uploading image...</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-border">
                          <ImageIcon className="w-7 h-7 text-secondary" />
                        </div>
                        <p className="text-primary font-medium mb-1">Click to upload an image</p>
                        <p className="text-xs text-secondary">SVG, PNG, JPG or GIF (max. 10MB)</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary resize-none"
                placeholder="Brief summary of your post"
                maxLength={200}
              />
              <p className="mt-1 text-xs text-secondary text-right">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Content *
              </label>
              <div className="prose-editor-container border border-border rounded-lg overflow-hidden bg-neutral-50 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your post here... (min 100 characters)"
                  />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-destructive">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-secondary text-right">
                {content.length} characters (minimum 100 required)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Categories
                  </label>
                  <CategorySelect
                    selected={formData.categories}
                    onChange={handleCategoryChange}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                    placeholder="javascript, webdev, tutorial"
                  />
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submission Guidelines
              </h3>
              <ul className="text-sm text-blue-800/80 space-y-1.5 list-disc list-inside">
                <li>Posts must be original content.</li>
                <li>Ensure high quality images and formatting.</li>
                <li>Respect intellectual property rights.</li>
                <li>Submissions are reviewed within 24-48 hours.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
