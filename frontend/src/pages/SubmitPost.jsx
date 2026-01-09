// frontend/src/pages/SubmitPost.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubmitPostMutation } from "../api/submissionsAPI";
import RichTextEditor from "../components/editor/RichTextEditor";
import CategorySelect from "../components/editor/CategorySelect";
import { toast } from "react-toastify";

export default function SubmitPost() {
  const navigate = useNavigate();
  const [submitPost, { isLoading }] = useSubmitPostMutation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit a Post
          </h1>
          <p className="text-gray-600">
            Your post will be reviewed by our admin team before publishing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter a compelling title (min 10 characters)"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                placeholder="Brief summary of your post"
                maxLength={200}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your post here... (min 100 characters)"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {content.length} characters (minimum 100 required)
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <CategorySelect
                selected={formData.categories}
                onChange={handleCategoryChange}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                placeholder="javascript, webdev, tutorial"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL (Optional)
              </label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Submission Guidelines:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Posts should be original and not plagiarized</li>
                <li>• Title must be at least 10 characters</li>
                <li>• Content must be at least 100 characters</li>
                <li>• No hate speech or inappropriate content</li>
                <li>• Review may take 24-48 hours</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#7fd3e6] text-white rounded-lg font-medium hover:bg-[#5bb9d0] disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
