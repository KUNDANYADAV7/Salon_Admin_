import React, { useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWomen } from '../../../context/WomenContext';

const WomenSelectedServices = () => {
  const { allwomenservices, handleDelete, getWomenServiceBySubtitle, loading } = useWomen();
  const { subTitle } = useParams();

  const decodedSubTitle = subTitle.replace(/-/g, " "); // Convert dashes back to spaces

        useEffect(() => {
          if (decodedSubTitle) {
            getWomenServiceBySubtitle(decodedSubTitle);
          }
        }, [decodedSubTitle]); 

  // Filter services based on the selected subTitle
  const filteredServices = allwomenservices.filter(service => service.subTitle === decodedSubTitle);

  // Check if any service has a category
  const hasCategory = filteredServices.some(service => service.category);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
          Women's {decodedSubTitle}
        </h1>
        <Link
          to="/dashboard/womens-services/create"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Service</span>
        </Link>
      </div>

      {filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-600">No Services Found</p>
          <p className="text-sm text-gray-500 text-center">Start adding services to manage and offer them.</p>
        </div>
      ) : !hasCategory ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-600">No Category Added</p>
          <p className="text-sm text-gray-500 mx-4 md:mx-0">This service has no category assigned.</p>
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="text-sm">
                    <td className="px-4 sm:px-6 py-4 whitespace-normal break-words">
                      <div className="font-medium text-blue-400 underline cursor-pointer">
                        {service.subTitle}
                      </div>
                      <div className="font-medium text-gray-900">{service.category || "No Category"}</div>
                      <div className="text-gray-500">
                        {service.description.slice(0,81)}...
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500">{service.duration}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500">Rs {service.price}</td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/dashboard/womens-services/create/${service._id}`} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-900">
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

export default WomenSelectedServices;
