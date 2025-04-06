// CertContext.js
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";
import { useAuth } from "./AuthProvider";

export const CertContext = createContext();

export const CertProvider = ({ children }) => {
  const [mycerts, setMyCerts] = useState([]);
  const [allcerts, setAllCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  

    const { isAuthenticated } = useAuth(); 

  // Fetch Certificates
  const fetchMyCerts = async () => {
    try {

      const token = localStorage.getItem("jwt");

      if (!token) return; // ✅ Prevent API call if no token
      setLoading(true);
      const { data } = await axios.get(`${config.apiUrl}/api/certificates/my-certificates`,
        { withCredentials: true }
      );
      setMyCerts(data);
    } catch (error) {
      // toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };


  // Fetch All Certificates of User
  const fetchAllCerts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${config.apiUrl}/api/certificates/all-certificates`,
        { withCredentials: true }
      );
      setAllCerts(data);
    } catch (error) {
    }finally {
      setLoading(false);
    }
  };




  // Create Certificate
  const createCert = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.apiUrl}/api/certificates/create`, formData, {
        withCredentials: true,
        headers: { 
          "Content-Type": "multipart/form-data" },
      });

     // Fetch updated blogs from API
     fetchMyCerts();
     fetchAllCerts();
      toast.success("Certificate created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create certificate");
    } finally {
      setLoading(false);
    }
  };


    // Update Certificate
    const updateCert = async (id, formData) => {
      try {
        setLoading(true);
        await axios.put(`${config.apiUrl}/api/certificates/update/${id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Certificate updated successfully");
        fetchMyCerts();
        fetchAllCerts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update certificate");
      }finally {
        setLoading(false);
      }
    };


    const handleDelete = async (id) => {
      try {
        const res = await axios.delete(`${config.apiUrl}/api/certificates/delete/${id}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Certificate deleted successfully");
    
        // Remove deleted blog from the state immediately
        setMyCerts((prevCerts) => prevCerts.filter((cert) => cert._id !== id));
        setAllCerts((prevCerts) => prevCerts.filter((cert) => cert._id !== id))
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete Certificate");
      }
    };


    const getCertById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}/api/certificates/single-certificate/${id}`, {
          withCredentials: true,
        });
    
        if (response.status !== 200) throw new Error("Failed to fetch certificate");
        return response.data; // Axios automatically parses JSON
      } catch (error) {
        // console.error("Error fetching certificate:", error.message);
        return null;
      }
      finally {
        setLoading(false); // Stop loading
      }
    };
    

  useEffect(() => {
    if (isAuthenticated) {
    fetchMyCerts();
    fetchAllCerts();
  }
  }, [isAuthenticated]);

  return (
    <CertContext.Provider value={{ mycerts,allcerts , loading, createCert, updateCert, getCertById, handleDelete }}>
      {children}
    </CertContext.Provider>
  );
};

export const useCert = () => useContext(CertContext);
