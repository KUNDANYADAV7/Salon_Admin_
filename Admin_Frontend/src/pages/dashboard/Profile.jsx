import React, { useState } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";
import config from "../../config";

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
    photo: null,
    preview: profile?.photo ? `${config.apiUrl}/${profile.photo}` : null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        photo: file,
        preview: imageUrl,
      }));
    }
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if (formData.photo) data.append("profile", formData.photo);

    await updateProfile(data);
    setEditMode(false);
    setFormData((prev) => ({ ...prev, phone: profile.phone }));
  };

  return (

    <div className="flex justify-center items-center px-0 md:px-4 mt-0 md:mt-10">
  <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-6">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Profile</h1>

    {/* Profile Image and Name */}
    <div className="flex flex-col sm:flex-row justify-center items-center space-x-4 mb-6 text-center sm:text-left">
      <div className="relative h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {formData.preview ? (
          <img
            src={formData.preview}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
        {editMode && (
          <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer">
            <Camera className="h-5 w-5 text-gray-600" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>
      <div className="mt-4 sm:mt-0">
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="text-lg font-semibold text-gray-800 border rounded-md px-2 py-1 w-full"
          />
        ) : (
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{profile?.name}</h2>
        )}
        <p className="text-gray-600 text-sm sm:text-base">{profile?.role}</p>
      </div>
    </div>

    {/* Email Section */}
    <div className="flex mx-0 md:mx-10  space-x-3 mb-4">
      <Mail className="h-5 w-5 text-gray-400" />
      <span className="text-gray-700 break-all">{profile?.email}</span>
    </div>

    {/* Phone Section */}
    <div className="flex mx-0 md:mx-10 space-x-3 mb-6">
      <Phone className="h-5 w-5 text-gray-400" />
      {editMode ? (
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Limit to 10 digits
            handleChange({ target: { name: 'phone', value } });
          }}
          className="border rounded-md px-2 py-1 text-gray-700 w-32 md:w-48"
          maxLength={10}
        />
      ) : (
        <span className="text-gray-700">+91 {profile?.phone}</span>
      )}
    </div>

    {/* Edit/Update Button */}
    <div className="text-center mt-6">
      {editMode ? (
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto"
        >
          Update
        </button>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto"
        >
          Edit Profile
        </button>
      )}
    </div>
  </div>
</div>

  );
};

export default Profile;