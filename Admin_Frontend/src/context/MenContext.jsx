

// MenContext.js
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";

export const MenContext = createContext();

export const MenProvider = ({ children }) => {
  const [mymenservices, setMyMenServices] = useState([]);
  const [allmenservices, setAllMenServices] = useState([]);
  const [loading, setLoading] = useState(false);



  // Fetch My Men Services without category unique services parent
  const fetchMenServicesnocategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${config.apiUrl}/api/menservices/no-category`,
        { withCredentials: true }
      );
      setMyMenServices(data);
    } catch (error) {
      // toast.error("Failed to load men's services");
    } finally {
      setLoading(false);
    }
  };


  // Create Men Service
  const createMenService = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.apiUrl}/api/menservices/create`, formData, {
        withCredentials: true,
        headers: { 
          "Content-Type": "multipart/form-data" },
      });
     // Fetch updated mens services from API
     fetchMenServicesnocategory()
    //  getMenServiceBySubtitle()
      toast.success("Men Service created successfully");
      return true;  
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create men service");
    }  finally {
      setLoading(false); // Ensure loading stops even if the API fails
    }
  };


    // Update Men Service
    const updateMenService = async (id, formData) => {
      try {
        setLoading(true);
        await axios.put(`${config.apiUrl}/api/menservices/update/${id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        fetchMenServicesnocategory()
        toast.success("Men Service updated successfully");
        return true; 
        // getMenServiceBySubtitle()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update men service");
      } finally {
        setLoading(false);
      }
    };


    const handleDelete = async (id) => {
      try {
        const res = await axios.delete(`${config.apiUrl}/api/menservices/delete/${id}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Men Service deleted successfully");
    
        // Remove deleted men service from the state immediately
        setMyMenServices((prevMens) => prevMens.filter((men) => men._id !== id));
        setAllMenServices((prevMens) => prevMens.filter((men) => men._id !== id))
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete men service");
      }
    };


    const handleDeleteBySubTitle = async (subTitle) => {
      try {
        // Encode subtitle to handle spaces
        const encodedSubTitle = encodeURIComponent(subTitle);
    
        const res = await axios.delete(`${config.apiUrl}/api/menservices/delete-subtitle/${encodedSubTitle}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Men Services deleted successfully");
    
        // Remove all services with matching subtitle from the state
        setMyMenServices((prevMens) => prevMens.filter((men) => men.subTitle !== subTitle));
        setAllMenServices((prevMens) => prevMens.filter((men) => men.subTitle !== subTitle));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete men services");
      }
    };
    


    const getMenServiceById = async (identifier) => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/menservices/single-menservice/${identifier}`, {
          withCredentials: true,
        });
    
        return response.data; // Axios automatically parses JSON
      } catch (error) {
        // console.error("Error fetching men service:", error.message);
        return null;
      }
    };

//get Men Services by Subtile child
  

    const getMenServiceBySubtitle = async (subTitle) => {
      try {
        if (!subTitle) {
          setAllMenServices([]); // ✅ Clear state when no subTitle is provided
          return;
        }

        const encodedSubTitle = encodeURIComponent(subTitle); // Ensure encoding
        const response = await axios.get(`${config.apiUrl}/api/menservices/menservices/${encodedSubTitle}`, {
          withCredentials: true,
        });
    
        setAllMenServices(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // ✅ No error log for 404, just clear the state
          setAllMenServices([]); 
        } else {
          console.error("Error fetching men service:", error.message);
        }
      }
    };
    


  useEffect(() => {
    fetchMenServicesnocategory()
    // getMenServiceBySubtitle()
  }, []);

  return (
    <MenContext.Provider value={{ mymenservices, allmenservices , loading, createMenService, updateMenService, getMenServiceById, handleDelete, getMenServiceBySubtitle,handleDeleteBySubTitle }}>
      {children}
    </MenContext.Provider>
  );
};

export const useMen = () => useContext(MenContext);
