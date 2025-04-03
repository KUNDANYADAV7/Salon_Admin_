import React, { useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useWomen } from '../../context/WomenContext';
import config from '../../config';

const HomeWomenSelectedSer = () => {

const { allwomenservices } = useWomen();
  const { subTitle } = useParams();

  const decodedSubTitle = subTitle.replace(/-/g, " "); // Convert dashes back to spaces

  // Filter services based on the selected subTitle
  const filteredServices = allwomenservices.filter(service => service.subTitle === decodedSubTitle);

  // Check if any service has a category
  const hasCategory = filteredServices.some(service => service.category);

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
  <div className="flex flex-col sm:flex-row justify-center items-center mb-6">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">
      Women's {decodedSubTitle}
    </h1>
  </div>

  {filteredServices.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-600">No Services Found</p>
      <p className="text-sm text-gray-500">Start adding services to manage and offer them.</p>
    </div>
  ) : !hasCategory ? (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-600">No Category Added</p>
      <p className="text-sm text-gray-500">This service has no category assigned.</p>
    </div>
  ) : (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <tbody className="bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.map((service) => (
              <tr key={service._id} className="text-sm">
                <td className="px-4 sm:px-6 py-4 whitespace-normal break-words">
                  {/* Image with hover effect */}
                  <div className="relative group rounded-full overflow-hidden hover:shadow-lg transition-shadow w-64 h-64">
                    <div className="relative w-full h-full">
                      <img
                        className="w-full h-full object-cover rounded-lg group-hover:opacity-50 cursor-pointer"
                        src={`${config.apiUrl}/${service?.photo}`}
                        alt={service?.subTitle}
                      />
                      {/* Content overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <div className="text-center text-white p-4">
                          <h3 className="text-lg font-semibold">{service.category || "No Category"}</h3>
                          <p className="mt-2">
                            {service.description.split(" ").length > 10
                              ? service.description.split(" ").slice(0, 25).join(" ") + "..."
                              : service.description}
                          </p>
                        </div>
                      </div>
                    </div>
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

  )
}

export default HomeWomenSelectedSer
