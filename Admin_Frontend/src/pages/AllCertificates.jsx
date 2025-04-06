import React, { useEffect } from 'react'
import { useCert } from '../context/CertProvider';
import config from '../config';
import { Link } from 'react-router-dom';

const AllCertificates = () => {
  const { allcerts, loading } = useCert();

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  // Sort certificates by `createdAt` in descending order (latest certificates first)
  const sortedCertificates = [...allcerts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-bold text-gray-600">Loading...</p>
      </div>
    );
  }

return (
<div className="max-w-4xl mx-auto mt-20 p-5 md:p-0">
  <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Certificate Posts</h1>
  <div className="grid gap-6">
  {sortedCertificates.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-gray-600">No Certificates Found</p>
      <p className="text-sm text-gray-500 mx-4 md:mx-0">Stay tuned! New certificates will be added soon.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
      {sortedCertificates.map((certificate) => (
        <Link to={`/allcertificate/${certificate?._id}`} key={certificate._id}>
        <CertificateCard key={certificate._id} {...certificate} />
        </Link>
      ))}
    </div>
  )}
  </div>
</div>
);
};

const CertificateCard = ({ title, createdAt, photo }) => (
<div className="bg-white rounded-lg shadow-md overflow-hidden">
<div className="md:flex">
  <div className="md:flex-shrink-0">
    <img className="h-48 w-full object-cover" src={`${config.apiUrl}/${photo}`} alt={title} />
    <div className="p-6">
    <div className="text-sm text-gray-600">{new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    <h2 className="text-xl font-semibold text-gray-800 mt-2">{title}</h2>
  </div>
  </div>
  
</div>
</div>
);

export default AllCertificates
