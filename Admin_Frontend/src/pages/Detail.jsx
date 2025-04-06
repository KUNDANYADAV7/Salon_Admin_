import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import config from "../config";

function Detail() {
  const { getBlogById, loading } = useBlog();
  const { slug } = useParams(); // Get the slug from URL
  const [blog, setBlog] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Track fetching state

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setIsFetching(true); // Start fetching
    setBlog(null); 
    const blogData = await getBlogById(slug);
    if (blogData) {
      setBlog(blogData);
    }
    setIsFetching(false); // Stop fetching
  };

  // **Show a loading message while fetching**
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-lg text-gray-500">Fetching blog, please wait...</p>
      </div>
    );
  }

  // If no blog found, show a message
  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-lg text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-10 mt-24">
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto bg-gray-100 p-8 shadow-lg rounded-lg">
        {/* Blog Category & Date */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-xl">
            {blog.category}
          </span>
          <span className="text-gray-700 text-sm sm:text-base mt-2 sm:mt-0 whitespace-nowrap">
            <span className="text-lg font-medium text-black">Created on: </span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Blog Image and Description */}
        <div className="prose">
          <div className="clearfix">
            {blog.photo && (
              <div className="w-full md:w-80 md:float-left md:mr-10 md:mb-6">
                <img
                  src={`${config.apiUrl}/${blog.photo}`}
                  alt={blog.title}
                  className="w-full h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="text-lg text-gray-700 leading-relaxed">
              <div className="space-y-4">
                <div>{blog?.about}</div>
              </div>
            </div>
          </div>
          <div className="w-full clear-both"></div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
