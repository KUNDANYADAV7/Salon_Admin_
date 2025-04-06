// import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOffer } from '../context/OfferContext';
import config from '../config';
import { useEffect } from 'react';

const Offers = () => {
  const { allOffers, loading } = useOffer();

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold text-gray-600">Loading...</p>
      </div>
    );
  }

  // Filter offers to only show active ones
  const activeOffers = allOffers.filter(offer => offer.isActive);



  // If no active offers, show a message
  if (activeOffers.length === 0) {
    return (
      <>

<div className="flex flex-col items-center justify-center">
  <h1 className="text-3xl font-bold text-gray-800 mt-20 text-center">Offers</h1>
</div>

<div className='mx-4 sm:mx-8 md:mx-16 lg:mx-60 flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md mt-7'>
  <p className="text-lg font-semibold text-gray-600 text-center">Special Offers</p>
  <p className="text-sm text-gray-500 text-center">No active offers or services found at the moment.</p>
</div>


    </>
    );
  }
  

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Special Offers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
        {activeOffers.map((offer) => (
          <Link to={`/offerdetail/${offer._id}`} key={offer._id}>
            <OfferCard {...offer} />
          </Link>
        ))}
      </div>
    </div>
  );
};

const OfferCard = ({ title, discount, validUntil, photo }) => (
  <div className="bg-white rounded-lg shadow-xl p-6 border-l-4 border-indigo-500 max-w-[280px] mx-auto">
    <div className="flex flex-row justify-center">
      <div>
        <img 
          src={`${config.apiUrl}/${photo}`} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-2xl font-bold text-indigo-600 mt-2">{discount}% OFF</p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Valid until:  {new Date(validUntil).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);




export default Offers;
