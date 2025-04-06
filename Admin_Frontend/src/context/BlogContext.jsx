

// BlogContext.js
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import toast from "react-hot-toast";
import { useAuth } from "./AuthProvider";

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [myblogs, setMyBlogs] = useState([]);
  const [allblogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

      const { isAuthenticated } = useAuth();

  // Fetch Blogs
  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("jwt");

      if (!token) return; // ✅ Prevent API call if no token

      setLoading(true);
      const { data } = await axios.get(`${config.apiUrl}/api/blogs/my-blog`,
        { withCredentials: true }
      );
      setMyBlogs(data);
    } catch (error) {
      // toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };


  // Fetch All Blogs of User
  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${config.apiUrl}/api/blogs/all-blogs`,
        { withCredentials: true }
      );
      setAllBlogs(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };




  // Create Blog
  const createBlog = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${config.apiUrl}/api/blogs/create`, formData, {
        withCredentials: true,
        headers: { 
          "Content-Type": "multipart/form-data" },
      });

     // Fetch updated blogs from API
     fetchMyBlogs();
     fetchAllBlogs();
      toast.success("Blog created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };


    // Update Blog
    const updateBlog = async (id, formData) => {
      try {
        setLoading(true);
        await axios.put(`${config.apiUrl}/api/blogs/update/${id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Blog updated successfully");
        fetchMyBlogs();
        fetchAllBlogs();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update blog");
      } finally {
        setLoading(false);
      }
    };


    const handleDelete = async (id) => {
      try {
        const res = await axios.delete(`${config.apiUrl}/api/blogs/delete/${id}`, {
          withCredentials: true,
        });
    
        toast.success(res.data.message || "Blog deleted successfully");
    
        // Remove deleted blog from the state immediately
        setMyBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        setAllBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id))
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete blog");
      }
    };


    const getBlogById = async (slug) => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}/api/blogs/single-blog/slug/${slug}`, {
          withCredentials: true,
        });
    
        if (response.status !== 200) throw new Error("Failed to fetch blog");
        return response.data; // Axios automatically parses JSON
      } catch (error) {
        // console.error("Error fetching blog:", error.message);
        return null;
      }finally {
        setLoading(false); // Stop loading
      }
    };
    

  useEffect(() => {
    if (isAuthenticated) {
    fetchMyBlogs();
    fetchAllBlogs();
  }
  }, [isAuthenticated]);

  return (
    <BlogContext.Provider value={{ myblogs,allblogs , loading, createBlog, updateBlog, getBlogById, handleDelete }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
