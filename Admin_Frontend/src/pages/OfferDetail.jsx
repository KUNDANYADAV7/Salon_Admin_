import React, { useEffect, useState } from 'react'
import { useOffer } from '../context/OfferContext'
import config from '../config';
import { useParams } from 'react-router-dom';

const OfferDetail = () => {
  const { getOfferById } = useOffer(); 
   const { id } = useParams(); // Get the slug from URL
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      window.scrollTo(0, 0);
      fetchOffer();
    }, [id]);
  
    const fetchOffer = async () => {
      setLoading(true);
      setOffer(null);
      const offerData = await getOfferById(id);
      if(offerData) {
        setOffer(offerData);
      }
      setLoading(false);
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-center text-lg text-gray-500">Fetching offer, please wait...</p>
        </div>
      );
    }


    if (!offer) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-center text-lg text-gray-500">Offer not found</p>
        </div>
      );
    }
  return (
    <section className="w-full bg-white py-10 mt-24">
      <div className="max-w-[90%] lg:max-w-[40%] mx-auto bg-white p-8 shadow-md rounded-lg">
        {/* offer Category & Date */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm mb-4">
          <span className="text-gray-700 text-sm sm:text-base mt-2 sm:mt-0 whitespace-nowrap">
            <span className="text-lg font-medium text-black">Created on: </span>
            {new Date(offer.validUntil).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
          </span>
        </div>



        {/* offer Image and Description */}
        <div className="prose">
  <div className="clearfix">
    {offer.photo && (
      <div className="w-full md:w-80 md:float-left md:mr-10 md:mb-6">
        <img
          src={`${config.apiUrl}/${offer.photo}`}
          alt={offer.title}
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>
    )}
    <div className="text-lg text-gray-700 leading-relaxed mt-5">
      {/* <h2 className="text-2xl font-bold mb-4">{offer.title}</h2> */}
      <div className="space-y-4">
        {/* <div className="offer-content" dangerouslySetInnerHTML={{ __html: offer?.about }} /> */}
        <span className="px-0 py-1  text-blue-600 rounded-md text-[20px] mt-20 md:mt-0">
            {offer.title}
          </span>
        <div>Discount: {offer?.discount}% OFF</div>

      </div>
    </div>
  </div>
  <div className="w-full clear-both"></div>
</div>

      </div>
    </section>
  )
}

export default OfferDetail
