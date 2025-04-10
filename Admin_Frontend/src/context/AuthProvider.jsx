import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 

  const LoadingScreen = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-cyan-400">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  };
  
 
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
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
    } 
    // finally {
    //   setLoading(false); // Set loading to false after fetching
    // }
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


  // useEffect(() => {
  //   const token = localStorage.getItem("jwt");
  //   if (token) {
  //     fetchProfile(); // Fetch user profile if token exists
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
  
    if (token) {
      setLoading(true); // Start loading
      fetchProfile()
        .catch(() => {
          localStorage.removeItem("jwt");
          setIsAuthenticated(false);
          setProfile(null);
        })
        .finally(() => setLoading(false)); // Ensure loading stops
    } else {
      setIsAuthenticated(false);
      setProfile(null);
      setLoading(false); // Stop loading if no token exists
    }
  }, []);
  
  
  // if (loading) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        handleLogout, 
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


