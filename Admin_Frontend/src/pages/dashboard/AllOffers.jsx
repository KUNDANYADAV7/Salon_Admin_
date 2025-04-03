import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOffer } from '../../context/OfferContext';
import { useNavigate } from 'react-router-dom';

const AllOffers = () => {
  const navigate = useNavigate();
  const { myOffers, handleDelete, handleToggleStatus, updateOffer, status } = useOffer();

  // Sort offers by `validUntil` in descending order
  const sortedOffers = [...myOffers].sort((a, b) => new Date(b.validUntil) - new Date(a.validUntil));

  // Toggle Active/Inactive status
  const handleToggle = async (offer) => {
    const updatedOffer = { ...offer, isActive: !offer.isActive };  // Change here to isActive
    await handleToggleStatus(offer._id, updatedOffer);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-3xl font-bold text-gray-800">Special Offers</h1>
        <Link
          to="/dashboard/offer's/create"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700  mt-3 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Offer</span>
        </Link>
      </div>

      {sortedOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-600">No Offers Available</p>
          <p className="text-sm text-gray-500 mx-6 md:mx-0">Start adding offers to attract more customers.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOffers.map((offer) => (
                <tr key={offer._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                    <div className="text-sm text-gray-500">{offer.discount}% OFF</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(offer.validFrom).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(offer.validUntil).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td 
  className="px-6 py-4 whitespace-nowrap cursor-pointer"
  onClick={() => handleToggle(offer)}
>
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
    offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'  // Change here to isActive
  }`}>
    {offer.isActive ? 'Active' : 'Inactive'}  
  </span>
</td>

<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => navigate(`/dashboard/offer's/create/${offer._id}`)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(offer._id)} className="text-red-600 hover:text-red-900">
                    <Trash className="h-5 w-5" />
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

export default AllOffers;
