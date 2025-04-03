import React, { useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWomen } from '../../context/WomenContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AllWomensServices = () => {

 const { mywomenservices, handleDelete, getWomenServiceBySubtitle, handleDeleteBySubTitle } = useWomen();
  const navigate = useNavigate();

  // Sort services by `createdAt` in descending order (latest services first)
  const sortedBlogs = [...mywomenservices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


const handleServiceClick = async (subTitle) => {
  const formattedTitle = encodeURIComponent(subTitle);
  await getWomenServiceBySubtitle(subTitle);
  navigate(`/dashboard/women's-services/${formattedTitle}`);
};



  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
              Women's Services
            </h1>
            <Link
              to="/dashboard/womens-services/create"
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Service</span>
            </Link>
          </div>
    
          {sortedBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-600">No Services Found</p>
              <p className="text-sm text-gray-500 mx-4 md:mx-0">Start adding services to manage and offer them.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      {sortedBlogs.duration && <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>}
                  {sortedBlogs.time && <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>}
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedBlogs.map((service) => (
                      <tr key={service._id} className="text-sm">
                        <td className="px-4 sm:px-6 py-4 whitespace-normal break-words">
                          <div className="font-medium text-blue-400 underline cursor-pointer" onClick={() => handleServiceClick(service.subTitle)} >{service.subTitle}</div>
                          <div className="text-gray-500">
                          {service.description.slice(0,81)}.......
                          </div>
                        </td>
                        {service.duration && <td className="px-4 sm:px-6 py-4 text-gray-500">{service.duration}</td>}
                    {service.price && <td className="px-4 sm:px-6 py-4 text-gray-500">Rs{service.price}</td>}
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <Link to={`/dashboard/womens-services/create/${service._id}`} className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button onClick={() => handleDeleteBySubTitle(service.subTitle)} className="text-red-600 hover:text-red-900">
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
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



export default AllWomensServices;