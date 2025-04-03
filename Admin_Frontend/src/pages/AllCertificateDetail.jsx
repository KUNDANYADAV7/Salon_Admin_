import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCert } from "../context/CertProvider";
import config from "../config";

function AllCertificateDetail() {
  const { getCertById } = useCert();
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    setLoading(true);
    const certificateData = await getCertById(id);
    if (certificateData) {
      setCertificate(certificateData);
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!certificate) return <p className="text-center mt-10 text-gray-500">Certificate not found</p>;

  return (
    <section className="w-full bg-white py-10 mt-24">
      <div className="max-w-[90%] lg:max-w-[40%] mx-auto bg-white p-6 md:p-8 shadow-lg rounded-lg">
        {/* Certificate Date */}
        <div className="text-gray-700 text-sm sm:text-base text-center mb-4">
          <span className="font-medium text-lg">Created on: </span>
          {new Date(certificate.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Certificate Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          {certificate.title}
        </h1>

        {/* Certificate Image */}
        {certificate.photo && (
          <div className="w-full flex justify-center">
            <img
              src={`${config.apiUrl}/${certificate.photo}`}
              alt={certificate.title}
              className="max-w-full md:max-w-lg h-auto object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default AllCertificateDetail;
