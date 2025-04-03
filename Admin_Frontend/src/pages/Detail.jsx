import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import './styles.css'
import { useBlog } from "../context/BlogContext";
import config from "../config";

function Detail() {
  const { getBlogById } = useBlog();
  const { slug } = useParams(); // Get the slug from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    const blogData = await getBlogById(slug);
    if(blogData) {
      setBlog(blogData);
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!blog) return <p className="text-center mt-10 text-gray-500">Blog not found</p>;

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
      {/* <h2 className="text-2xl font-bold mb-4">{blog.title}</h2> */}
      <div className="space-y-4">
        {/* <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog?.about }} /> */}
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
