import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";

export const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const [myOffers, setMyOffers] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch My Offers
  const fetchMyOffers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${config.apiUrl}/api/offers/my-offer`, {
        withCredentials: true,
      });
      setMyOffers(data);
    } catch (error) {
      // console.error("Failed to load offers", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Active Offers
  const fetchAllOffers = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/api/offers/all-offers`, {
        withCredentials: true,
      });
      setAllOffers(data);
    } catch (error) {
      // console.error("Failed to load offers", error);
    }
  };

  // Create Offer
  const createOffer = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.apiUrl}/api/offers/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchMyOffers();
      fetchAllOffers();
      toast.success("Offer created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  // Update Offer
  const updateOffer = async (id, formData) => {
    try {
      setLoading(true);
      await axios.put(`${config.apiUrl}/api/offers/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Offer updated successfully");
      fetchMyOffers();
      fetchAllOffers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  // Delete Offer
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${config.apiUrl}/api/offers/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Offer deleted successfully");
      setMyOffers((prev) => prev.filter((offer) => offer._id !== id));
      setAllOffers((prev) => prev.filter((offer) => offer._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer");
    }
  };

  // Get Single Offer
  const getOfferById = async (id) => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/offers/single-offer/${id}`, {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error("Failed to fetch offer");
      return response.data;
    } catch (error) {
      // console.error("Error fetching offer:", error.message);
      return null;
    }
  };

  const handleToggleStatus = async (offerId) => {
    try {
      const response = await axios.put(`${config.apiUrl}/api/offers/toggle-status/${offerId}`, {}, { withCredentials: true });
  
      if (response.status === 200) {
        toast.success(response.data.message);
        
        // Update state instead of refetching all offers
        setMyOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer._id === offerId ? { ...offer, isActive: !offer.isActive } : offer
          )
        );
        fetchAllOffers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };
  
 
  


  useEffect(() => {
    fetchMyOffers();
    fetchAllOffers();
  }, []);

  return (
    <OfferContext.Provider
      value={{ myOffers, allOffers, loading, createOffer, updateOffer, getOfferById, handleDelete, handleToggleStatus }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export const useOffer = () => useContext(OfferContext);
