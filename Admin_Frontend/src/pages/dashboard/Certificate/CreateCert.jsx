import React, { useState, useEffect } from "react";
import { useCert } from "../../../context/CertProvider";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import config from "../../../config";
import toast from "react-hot-toast";

// createCert, updateCert, getCertById,

const CreateCert = () => {
  const { createCert, updateCert, getCertById, loading } = useCert();
  const { id } = useParams(); // Get blogId from URL params for edit mode
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchBlog = async () => {
        const blogData = await getCertById(id);
        if (blogData) {
          setFormData({
            title: blogData.title,
            photo: null, // Keep null to avoid sending an old image unintentionally
          });
          setPreview(`${config.apiUrl}/${blogData.photo}`); // Assuming the API returns an image URL
          // `${config.apiUrl}/${blogData.photo}`
        }
      };
      fetchBlog();
    }
  }, [id, getCertById]);

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
    const data = new FormData();
    data.append("title", formData.title);
    if (formData.photo) {
      data.append("certificateImage", formData.photo);
    }

    if (isEditMode) {
      await updateCert(id, data);
    } else {
      await createCert(data);
    }

    // Reset form fields and redirect
    setFormData({ title: "", photo: null });
    setPreview(null);
    navigate("/dashboard/certs");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard/blogs" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Certificates</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">{isEditMode ? "Edit Certificate" : "Create Certificate"}</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Title</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Image</label>
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
                <input id="file-upload" type="file" name="photo" className="sr-only" onChange={handleChange}  />
              </label>
            </div>
          </div>



          <div className="flex justify-end space-x-4">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading} >
              {loading ? "Processing..." : isEditMode ? "Update Post" : "Publish Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCert;
