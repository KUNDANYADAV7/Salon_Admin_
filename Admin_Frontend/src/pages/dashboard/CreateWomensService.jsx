import React, { useState, useEffect } from "react";
import { useWomen } from "../../context/WomenContext";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import config from "../../config";

const serviceOptions = {
  "Hair Services": [
    "Haircuts",
    "Hair Styling",
    "Hair Coloring & Highlights",
    "Hair Smoothrning/Rebonding",
    "Keratin & Protine Treatments",
    "Scalp & Hair Spa",
  ],
  "Facial & Skincare": [
    "Gold / Diamond / Pearl Facial",
    "Skin Brightening Treatments",
    "Hydrating Facial",
    "Acne Treatment",
    "Anti-Aging Treatments",
  ],
  "Manicure & Pedicure": [
    "Gel / French / Nail Art Manicure",
    "Spa Pedicure",
    "Nail Extensions",
    "Paraffin Wax Treatment",
  ],
  "Waxing & Hair Removal": [
    "Full Body Waxing",
    "Threading",
  ],
  "Makeup & Beauty": [
    "Bridal Makeup",
    "Party Makeup",
    "HD & Airbrush Makeup",
    "Saree Draping & Hairstyling",
  ],
  "Massage & Relaxation": [
    "Head, Neck & Shoulder Massage",
    "Full Body Massage",
    "Foot Reflexology",
  ],
  "Bridal Packages": [
    "Full Bridal Beauty Package",
    "Pre-Wedding Skincare & Spa",
  ],
};

const CreateWomensService = () => {
  const { createWomenService, updateWomenService, getWomenServiceById, loading } = useWomen();
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
      const fetchWomenService = async () => {
        const womenData = await getWomenServiceById(id);
        if (womenData) {
          setFormData({
            title: womenData.title,
            subTitle: womenData.subTitle,
            category: womenData.category,
            description: womenData.description,
            duration: womenData.duration,
            price: womenData.price,
            photo: null,
          });
          setPreview(`${config.apiUrl}/${womenData.photo}`);
          // `${config.apiUrl}/${womenData.photo}`
        }
      };
      fetchWomenService();
    }
  }, [id, getWomenServiceById]);

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

  // Conditionally include category only when title is "WoWomen's Sub-Service"
  if (formData.title === "Women's Sub-Service") {
    data.append("category", formData.category);
    if (formData.duration) data.append("duration", formData.duration);
      if (formData.price) data.append("price", formData.price);
  }

  if (formData.photo) {
    data.append("womenimage", formData.photo);
  }

  try {
    let success = false;
    if (isEditMode) {
      success = await updateWomenService(id, data);
    } else {
      success = await createWomenService(data);
    }

    if (success) {
      setFormData({
        title: "Women's Service",
        subTitle: "",
        category: "",
        description: "",
        duration: "",
        price: "",
        photo: null,
      });
      setPreview(null);
      navigate("/dashboard/women's-services");
    }
  } catch (error) {
    // console.error("Submission error:", error);
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/dashboard/women's-services"
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Services</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isEditMode ? "Edit Women's Service" : "Create Women's Service"}
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
               {!formData.category && <option value="Women's Service">Change Women's Service</option>}
                {/* Show "Women's Sub-Service" in create mode OR when updating and category exists */}
    {(!isEditMode || formData.category) && (
      <option value="Women's Sub-Service">Change Sub-Service</option>
    )}
            </select>
          </div>

          {/* Main Service Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Women's Service</label>
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
          {formData.title === "Women's Sub-Service" && formData.subTitle && (
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
          {formData.title === "Women's Sub-Service" &&  (
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
                <input id="file-upload" type="file" name="photo" className="sr-only" onChange={handleChange} />
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
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? "Processing..." : isEditMode ? "Update Service" : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWomensService;
