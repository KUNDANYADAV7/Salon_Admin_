import React, { useState, useEffect } from "react";
import { useMen } from "../../context/MenContext";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import config from "../../config";

const serviceOptions = {
  "Hair Services": [
    "Haircuts",
    "Beard Trimming & Shaping",
    "Hair Coloring & Highlights",
    "Hair Spa & Scalp Treatments",
    "Keratin Treatment",
    "Dandruff Treatment",
  ],
  "Facial & Skincare": [
    "Deep Cleansing Facial",
    "Anti-Tan Facial",
    "Acne Treatment",
    "Anti-Aging Facial",
    "Skin Polishing",
  ],
  "Manicure & Pedicure": [
    "Basic Manicure & Pedicure",
    "Callus Removal",
    "Nail Grooming",
    "Hand & Foot Spa",
  ],
  "Waxing & Hair Removal": [
    "Full Body Waxing",
    "Beard Line Waxing",
    "Back & Chest Waxing",
  ],
  "Massage & Relaxation": [
    "Head, Neck & Shoulder Massage",
    "Full Body Massage",
    "Foot Reflexology",
  ],
  "Groom Packages": [
    "Grooming Package",
    "Pre-Wedding Skincare",
  ],
};

const CreateMensService = () => {
  const { createMenService, updateMenService, getMenServiceById, loading } = useMen();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    category: "",
    description: "",
    duration: "",
    price: "",
    photo: null,
  });

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchMenService = async () => {
        const menData = await getMenServiceById(id);
        if (menData) {
          setFormData({
            title: menData.title,
            subTitle: menData.subTitle,
            category: menData.category,
            description: menData.description,
            duration: menData.duration,
            price: menData.price,
            photo: null,
          });
          setPreview(`${config.apiUrl}/${menData.photo}`);
          // `${config.apiUrl}/${menData.photo}`
        }
      };
      fetchMenService();
    }
  }, [id, getMenServiceById]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


const handleSubmit = async (event) => {
  event.preventDefault();
  const data = new FormData();
  
  data.append("title", formData.title);
  data.append("subTitle", formData.subTitle);
  data.append("description", formData.description);

  // Conditionally include category only when title is "Men's Sub-Service"
  if (formData.title === "Men's Sub-Service") {
    data.append("category", formData.category);
    if (formData.duration) data.append("duration", formData.duration);
      if (formData.price) data.append("price", formData.price);
  }

  if (formData.photo) {
    data.append("menimage", formData.photo);
  }

  try {
    let success = false;
    if (isEditMode) {
      success = await updateMenService(id, data);
    } else {
      success = await createMenService(data);
    }

    if (success) {
      setFormData({
        title: "",
    subTitle: "",
    category: "",
    description: "",
    duration: "",
    price: "",
    photo: null,
      });
      setPreview(null);
      navigate("/dashboard/men's-services");
    }
  } catch (error) {
    // console.error("Submission error:", error);
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/dashboard/men's-services"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Services</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditMode ? "Edit Men's Service" : "Create Men's Service"}
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Title Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Option</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            >
               <option value="">Select...</option>
               {!formData.category && <option value="Men's Service">Change Men's Service</option>}
                {/* Show "Men's Sub-Service" in create mode OR when updating and category exists */}
    {(!isEditMode || formData.category) && (
      <option value="Men's Sub-Service">Change Sub-Service</option>
    )}
            </select>
          </div>

          {/* Main Service Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Men's Service</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="subTitle"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value, category: "" })}
              required
            >
              <option value="" disabled>Select a service</option>
              {Object.keys(serviceOptions).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Service Dropdown */}
          {formData.title === "Men's Sub-Service" && formData.subTitle && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Sub-Service</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a sub-service</option>
                {serviceOptions[formData.subTitle].map((subService) => (
                  <option key={subService} value={subService}>
                    {subService}
                  </option>
                ))}
              </select>
            </div>
          )}

                     {/* Duration & price Fields */}
                     {formData.title === "Men's Sub-Service" &&  (
            <>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
  <input
    type="text"
    name="duration"
    placeholder="Enter Duration"
    value={formData.duration}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
</div>

<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
  <input
    type="text"
    name="price"
    placeholder="Enter price"
    value={formData.price}
    onChange={handleChange}
    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    required
  />
</div>

            </>
          )}

          {/* Image Upload (Updated Design) */}
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
                <input id="file-upload" type="file" name="photo" className="sr-only" onChange={handleChange}  />
              </label>
            </div>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Enter service description"
            required
          />

          {/* Submit Button */}
          <button
  type="submit"
  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
  disabled={loading} // Disable button when loading
>
  {loading ? "Processing..." : isEditMode ? "Update Service" : "Create Service"}
</button>

        </form>
      </div>
    </div>
  );
};

export default CreateMensService;

