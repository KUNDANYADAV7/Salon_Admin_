import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from "../../context/BlogContext";

const AllBlogs = () => {
  const { myblogs, handleDelete, loading } = useBlog();

    // Sort blogs by `createdAt` in descending order (latest blogs first)
    const sortedBlogs = [...myblogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl font-bold text-gray-600">Loading...</p>
        </div>
      );
    }

  return (
    <div className="max-w-6xl md:mx-auto">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
        <Link
          to="/dashboard/blogs/create"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700  mt-2 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Post</span>
        </Link>
      </div>

      {sortedBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-600">No Blogs Found</p>
          <p className="text-sm text-gray-500 mx-5 md:mx-0">Start creating blogs to manage and share your content.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
           <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.about.slice(0,20)}....</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Link to={`/dashboard/blogs/create/${blog._id}/${blog.slug}`}>
                    <Edit className="h-5 w-5" />
                    </Link>
                  </button>
                  <button onClick={()=>handleDelete(blog._id)} className="text-red-600 hover:text-red-900">
                  <Link>
                    <Trash className="h-5 w-5" />
                    </Link>
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
