import React, { useState, useEffect } from "react";
import { useBlog } from "../../context/BlogContext";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const { createBlog, updateBlog, getBlogById, loading } = useBlog();
  const { id, slug } = useParams(); // Get blogId from URL params for edit mode
  const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    photo: null,
    category: "",
    about: "",
  });
  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      const fetchBlog = async () => {
        const blogData = await getBlogById(slug);
        if (blogData) {
          setFormData({
            title: blogData.title,
            category: blogData.category,
            about: blogData.about,
            photo: null, // Keep null to avoid sending an old image unintentionally
          });
          setPreview(`${config.apiUrl}/${blogData.photo}`); // Assuming the API returns an image URL
          // `${config.apiUrl}/${blogData.photo}`
        }
      };
      fetchBlog();
    }
  }, [slug, getBlogById]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file)); // Set preview image
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo && !isEditMode) {
      toast.error("Image field is required!"); // Set error message
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("about", formData.about);
    if (formData.photo) {
      data.append("blogImage", formData.photo);
    }

    if (isEditMode) {
      await updateBlog(id, data);
    } else {
      await createBlog(data);
    }

    setIsSubmitting(false);

    // Reset form fields and redirect
    setFormData({ title: "", photo: null, category: "", about: "" });
    setPreview(null);
    navigate("/dashboard/blogs");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard/blogs" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Blogs</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">{isEditMode ? "Edit Blog Post" : "Create Blog Post"}</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter blog title"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md mb-4" />
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input id="file-upload" type="file" name="photo" className="sr-only" onChange={handleChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter category"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              name="about"
              value={formData.about}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your blog content..."
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
  disabled={isSubmitting}>
              {isSubmitting ? "Processing..." :isEditMode ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
