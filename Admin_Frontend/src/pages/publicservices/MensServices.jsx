import React from 'react';
import { useMen } from '../../context/MenContext';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const MensServices = () => {
  const { mymenservices, getMenServiceBySubtitle } = useMen();
  const navigate = useNavigate();

  // Sort services by `createdAt` in descending order (latest services first)
  const sortedMenServices = [...mymenservices].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Handle service click
  const handleMenServiceClick = async (subTitle) => {
    const formattedTitle = encodeURIComponent(subTitle);
    await getMenServiceBySubtitle(subTitle);
    navigate(`/home-men-service/${formattedTitle}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-20 text-center">Men's Services</h1>

      {sortedMenServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md m-4 md:m-0">
          <p className="text-lg font-semibold text-gray-600">No Services Found</p>
        </div>
      ) : ( 
        <div className="bg-white rounded-lg  overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
              {sortedMenServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  onClick={() => handleMenServiceClick(service.subTitle)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ subTitle, description, photo, onClick }) => (
  <div 
    className="relative group rounded-full overflow-hidden hover:shadow-lg transition-shadow w-64 h-64" 
    onClick={onClick}
  >
    <div className="relative w-full h-full">
      <img
        className="w-full h-full object-cover rounded-lg group-hover:opacity-50 cursor-pointer"
        src={`${config.apiUrl}/${photo}`}
        alt={subTitle}
      />
      {/* Content overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <div className="text-center text-white p-4">
          <h3 className="text-lg font-semibold">{subTitle}</h3>
          <p className="mt-2">{description}</p>
        </div>
      </div>
    </div>
  </div>
);


export default MensServices;
