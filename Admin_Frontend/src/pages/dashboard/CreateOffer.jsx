import React, { useState, useEffect } from "react";
import { useOffer } from "../../context/OfferContext"; // Assuming you have an OfferContext
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import toast from "react-hot-toast";

const CreateOffer = () => {
  const { createOffer, updateOffer, getOfferById, loading } = useOffer();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    validFrom: "",
    validUntil: "",
    photo: null,
    // active: id ? false : true,
  });

  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchOffer = async () => {
        const offerData = await getOfferById(id);
        if (offerData) {
          setFormData({
            title: offerData.title,
            description: offerData.description,
            discount: offerData.discount,
            validFrom: offerData.validFrom ? new Date(offerData.validFrom).toISOString().split('T')[0] : "",
            validUntil: offerData.validUntil ? new Date(offerData.validUntil).toISOString().split('T')[0] : "",
            photo: null,
            active: offerData.active,
          });          
          setPreview(`${config.apiUrl}/${offerData.photo}`);
        }
      };
      fetchOffer();
    }
  }, [id, getOfferById]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else if (e.target.type === "checkbox") {
      setFormData({ ...formData, active: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo && !isEditMode) {
      toast.error("Image field is required!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("discount", formData.discount);
    data.append("validFrom", formData.validFrom);
    data.append("validUntil", formData.validUntil);
    if (!isEditMode) {
      data.append("active", formData.active); // Only include 'active' when creating a new offer
    }
    if (formData.photo) {
      data.append("offerImage", formData.photo);
    }

    if (isEditMode) {
      await updateOffer(id, data);
    } else {
      await createOffer(data);
    }

    setFormData({
      title: "",
      description: "",
      discount: "",
      validFrom: "",
      validUntil: "",
      photo: null,
      active: false,
    });
    setPreview(null);
    navigate("/dashboard/offers");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard/offers" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Offers</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">{isEditMode ? "Edit Offer" : "Create Special Offer"}</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter offer title"
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

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter discount percentage"
                onChange={handleChange}
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* <div className="flex items-center">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
            <label className="ml-2 text-sm">Active</label>
          </div> */}

          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading} >
            {loading ? "Processing..." : isEditMode ? "Update Offer" : "Create Offer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOffer;
