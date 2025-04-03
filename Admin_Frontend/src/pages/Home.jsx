import React from "react";
import { useMen } from "../context/MenContext";
import { useWomen } from "../context/WomenContext";
import { useBlog } from "../context/BlogContext";
import { useCert } from "../context/CertProvider";
import { useNavigate, Link } from "react-router-dom";
import config from "../config";

const Home = () => {
  const { mymenservices, getMenServiceBySubtitle } = useMen();
  const { mywomenservices, getWomenServiceBySubtitle } = useWomen();
  const { allblogs } = useBlog();
  const { allcerts } = useCert();
  const navigate = useNavigate();

  // Sorting helper function
  const getLatestItems = (items, count = 3) =>
    [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, count);

  const latestMenServices = getLatestItems(mymenservices);
  const latestWomenServices = getLatestItems(mywomenservices);
  const latestBlogs = getLatestItems(allblogs);
  const latestCertificates = getLatestItems(allcerts);

  // Navigation Handlers
  const handleServiceClick = async (subTitle, getService, route) => {
    await getService(subTitle);
    navigate(`${route}/${encodeURIComponent(subTitle)}`);
  };

  // Reusable Card Components
  const ServiceCard = ({ service, onClick }) => (
<div
  className="relative group overflow-hidden hover:shadow-lg transition-shadow  rounded-full  w-50 h-50 sm:h-48 sm:w-48 lg:h-64 lg:w-64"
  onClick={() => onClick(service.subTitle)}
>

  <div className="relative h-full w-full">
    <img
      className="h-full w-full object-cover rounded-full aspect-square group-hover:opacity-50 cursor-pointer"
      src={`${config.apiUrl}/${service.photo}`}
      alt={service.subTitle}
    />
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
      <div className="text-center text-white p-4">
        <h3 className="text-lg font-semibold">{service.subTitle}</h3>
        <p className="mt-2">{service.description}</p>
      </div>
    </div>
  </div>
</div> 
 
  );

  const BlogCard = ({ blog }) => (
    <div className="bg-white border border-gray-300 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition w-full sm:w-[360px]">
      <Link to={`/blog/${blog.slug}`}>
        <img src={`${config.apiUrl}/${blog.photo}`} alt={blog.title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{blog.title}</h2>
        <p className="text-sm text-gray-600">{blog.about?.slice(0, 100)}...</p>
      </div>
    </div>
  );

const CertificateCard = ({ certificate }) => (
  <div className="bg-white border border-gray-300 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition w-full sm:w-[360px]">
    <Link to={`/allcertificate/${certificate._id}`}>
      <img 
        src={`${config.apiUrl}/${certificate.photo}`} 
        alt={certificate.title} 
        className="w-full h-48 object-cover"
      />
    </Link>
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">{certificate.title}</h2>
      <p className="text-sm text-gray-600 text-center">{new Date(certificate.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
    </div>
  </div>
);


  return (
    <div className="max-w-7xl mx-auto px-0 md:px-6 py-12">
     {[
  {
    title: "Men's Services",
    data: latestMenServices,
    route: "/home-men-service", // For individual services
    seeAllRoute: "/mens-services", // For 'See All' button
    handler: getMenServiceBySubtitle
  },
  {
    title: "Women's Services",
    data: latestWomenServices,
    route: "/home-women-service", // For individual services
    seeAllRoute: "/womens-services", // For 'See All' button
    handler: getWomenServiceBySubtitle
  }
].map(({ title, data, route, seeAllRoute, handler }, index) => (
  <Section key={index} title={title} onSeeAll={() => navigate(seeAllRoute)}>
    {data.length ? data.map(service => (
      <ServiceCard 
        key={service._id} 
        service={service} 
        onClick={(sub) => handleServiceClick(sub, handler, route)} 
      />
    )) : <NoDataMessage />}
  </Section>
))}

      <Section title="Latest Blogs" data={latestBlogs} onSeeAll={() => navigate("/blogs")}>
        {latestBlogs.length ? latestBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />) : <NoDataMessage />}
      </Section>
      <Section title="Latest Certificates" data={latestCertificates} onSeeAll={() => navigate("/allcertificate")}>
        {latestCertificates.length ? latestCertificates.map(certificate => <CertificateCard key={certificate._id} certificate={certificate} />) : <NoDataMessage />}
      </Section>
    </div>
  );
};

const Section = ({ title, children, onSeeAll }) => (
  <div className="border-0 border-gray-400 rounded-lg p-8 shadow-lg mb-12 mt-10">
    <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">{title}</h1>
    <div className="flex flex-wrap md:flex-nowrap justify-between gap-10 md:px-20">{children}</div>
    <div className="flex justify-center mt-8">
      <button onClick={onSeeAll} className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
        See All
      </button>
    </div>
  </div>
);

const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-100 rounded-lg shadow-md">
    <p className="text-lg font-semibold text-gray-600">No Items Found</p>
  </div>
);

export default Home;
