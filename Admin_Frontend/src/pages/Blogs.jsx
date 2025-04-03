// import React from 'react';
// import { useBlog } from '../context/BlogContext';
// import config from '../config';
// import { Link, useNavigate } from 'react-router-dom';

// const Blogs = () => {
//   const { allblogs } = useBlog();

//       // Sort blogs by `createdAt` in descending order (latest blogs first)
//       const sortedBlogs = [...allblogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   return (
//     <div className="max-w-4xl mx-auto mt-20">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Blog Posts</h1>
//       <div className="grid gap-6">
//       {sortedBlogs.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md m-4 md:m-0">
//           <p className="text-lg font-semibold text-gray-600">No Blogs Found</p>
//           <p className="text-sm text-gray-500 mx-4 md:mx-0">Stay tuned! New blogs will be added soon.</p>
//         </div>
//       ) : (
//         <div className="grid gap-6  p-4 sm:p-0">
//           {sortedBlogs.map((blog) => (
//             <Link to={`/blog/${blog?.slug}`} key={blog._id}>
//             <BlogCard key={blog._id} {...blog} />
//             </Link>
//           ))}
//         </div>
//       )}
//       </div>
//     </div>
//   );
// };

// const navigate = useNavigate();

// const BlogCard = ({ title, createdAt, about, photo }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="md:flex">
//       <div className="md:flex-shrink-0">
//         <img className="h-48 w-full object-cover md:w-48" src={`${config.apiUrl}/${photo}`} alt={title} />
//       </div>
//       <div className="p-6">
//         <div className="text-sm text-gray-600">{new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
//         <h2 className="text-xl font-semibold text-gray-800 mt-2">{title}</h2>
//         <p className="mt-3 text-gray-600">{about.slice(0,150)}...</p>
//       <button onClick={() => navigate(`/about/${id}`)} className="text-blue-500 font-semibold mt-2 hover:underline">
//         Read More
//       </button>
//       </div>
//     </div>
//   </div>
// );



// export default Blogs;




import React from 'react';
import { useBlog } from '../context/BlogContext';
import config from '../config';
import { Link, useNavigate } from 'react-router-dom';

const Blogs = () => {
  const { allblogs } = useBlog();

  const sortedBlogs = [...allblogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Blog Posts</h1>
      <div className="grid gap-6">
        {sortedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md m-4 md:m-0">
            <p className="text-lg font-semibold text-gray-600">No Blogs Found</p>
            <p className="text-sm text-gray-500 mx-4 md:mx-0">Stay tuned! New blogs will be added soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 p-4 sm:p-0">
            {sortedBlogs.map((blog) => (
              <Link to={`/blog/${blog?.slug}`} key={blog._id}>
                <BlogCard {...blog} id={blog._id} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ title, createdAt, about, photo, id }) => {
  const navigate = useNavigate(); // ✅ Correct placement inside the component

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:w-48" src={`${config.apiUrl}/${photo}`} alt={title} />
        </div>
        <div className="p-6">
          <div className="text-sm text-gray-600">
            {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mt-2">{title}</h2>
          <p className="mt-3 text-gray-600">{about.slice(0, 150)}...</p>
          <button
            onClick={() => navigate(`/blog/${id}`)}
            className="text-blue-500 font-semibold mt-2 hover:underline"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
