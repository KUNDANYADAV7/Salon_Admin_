

// WomenContext.js
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";

export const WomenContext = createContext();

export const WomenProvider = ({ children }) => {
  const [mywomenservices, setMyWomenServices] = useState([]);
  const [allwomenservices, setAllWomenServices] = useState([]);
  const [loading, setLoading] = useState(false);



  // Fetch My Women Services without category unique services parent
  const fetchWomenServicesnocategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${config.apiUrl}/api/womenservices/no-category`,
        { withCredentials: true }
      );
      setMyWomenServices(data);
    } catch (error) {
      // toast.error("Failed to load women's services");
    } finally {
      setLoading(false);
    }
  };


  // Create Women Service
  const createWomenService = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.apiUrl}/api/womenservices/create`, formData, {
        withCredentials: true,
        headers: { 
          "Content-Type": "multipart/form-data" },
      });
     // Fetch updated mens services from API
     fetchWomenServicesnocategory()
    //  getWomenServiceBySubtitle()
      toast.success("Women Service created successfully");
      return true;  
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create women service");
    } finally {
      setLoading(false);
    }
  };


    // Update Women Service
    const updateWomenService = async (id, formData) => {
      try {
        setLoading(true);
        await axios.put(`${config.apiUrl}/api/womenservices/update/${id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        fetchWomenServicesnocategory()
        toast.success("Women Service updated successfully");
        return true; 
        // getWomenServiceBySubtitle()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update women service");
      } finally {
        setLoading(false);
      }
    };


    const handleDelete = async (id) => {
      try {
        const res = await axios.delete(`${config.apiUrl}/api/womenservices/delete/${id}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Women Service deleted successfully");
    
        // Remove deleted women service from the state immediately
        setMyWomenServices((prevWomens) => prevWomens.filter((women) => women._id !== id));
        setAllWomenServices((prevWomens) => prevWomens.filter((women) => women._id !== id))
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete women service");
      }
    };


    const handleDeleteBySubTitle = async (subTitle) => {
      try {
        // Encode subtitle to handle spaces
        const encodedSubTitle = encodeURIComponent(subTitle);
    
        const res = await axios.delete(`${config.apiUrl}/api/womenservices/delete-subtitle/${encodedSubTitle}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Women Services deleted successfully");
    
        // Remove all services with matching subtitle from the state
        setMyWomenServices((prevWomens) => prevWomens.filter((women) => women.subTitle !== subTitle));
        setAllWomenServices((prevWomens) => prevWomens.filter((women) => women.subTitle !== subTitle));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete women services");
      }
    };

    const getWomenServiceById = async (identifier) => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/womenservices/single-womenservice/${identifier}`, {
          withCredentials: true,
        });
    
        return response.data; // Axios automatically parses JSON
      } catch (error) {
        // console.error("Error fetching women service:", error.message);
        return null;
      }
    };


    const getWomenServiceBySubtitle = async (subTitle) => {
      try {
        const encodedSubTitle = encodeURIComponent(subTitle); // Ensure encoding
        const response = await axios.get(`${config.apiUrl}/api/womenservices/womenservices/${encodedSubTitle}`, {
          withCredentials: true,
        });
    
        setAllWomenServices(response.data);
      } catch (error) {
        // console.error("Error fetching women service:", error.message);
        return null;
      }
    };
    
    
    

  useEffect(() => {
    fetchWomenServicesnocategory()
    // getWomenServiceBySubtitle()
  }, []);

  return (
    <WomenContext.Provider value={{ mywomenservices, allwomenservices , loading, createWomenService, updateWomenService, getWomenServiceById, handleDelete, getWomenServiceBySubtitle, handleDeleteBySubTitle }}>
      {children}
    </WomenContext.Provider>
  );
};

export const useWomen = () => useContext(WomenContext);
