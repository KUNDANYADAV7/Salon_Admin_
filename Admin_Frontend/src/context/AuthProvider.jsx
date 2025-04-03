import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
// Fetch Profile
  const fetchProfile = async () => {
    try {
      let token = localStorage.getItem("jwt");
      if (token) {
        const { data } = await axios.get(
          `${config.apiUrl}/api/users/my-profile`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );


        setProfile(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // console.error("Failed to fetch profile", error);
    }
  };




  // Update Profile
  const updateProfile = async (formData) => {
    try {
      let token = localStorage.getItem("jwt");

      const { data } = await axios.put(
        `${config.apiUrl}/api/users/update-profile/${profile._id}`,
        formData,
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error.response && error.response.data.message === "Phone number already exists") {
        toast.error("Phone number already exists. Please use a different one.");
      } else {
        toast.error("Failed to update profile");
      }
      // console.error("Update error:", error);
    }
  };



  // Logout
  const handleLogout = async (navigateTo) => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/api/users/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("jwt"); // Removing token from localStorage
      toast.success(data.message);
      setProfile(null);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        handleLogout, 
        carousels,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
