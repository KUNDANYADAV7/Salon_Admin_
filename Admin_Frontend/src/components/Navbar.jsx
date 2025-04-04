// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Menu,
//   X,
//   Scissors,
//   Home,
//   Users,
//   BookOpen,
//   Gift,
//   LayoutDashboard,
//   LogOut,
// } from "lucide-react";
// import { useAuth } from "../context/AuthProvider";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const { handleLogout, profile } = useAuth();
//   const navigateTo = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation(); // Get current route

//   // Close Mobile Menu when Screen Resizes
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) setIsOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const closeMenu = () => setIsOpen(false);

//   return (
//     <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <Scissors className="h-8 w-8 text-indigo-600" />
//             <span className="text-xl font-bold text-gray-800 truncate">
//               StyleHub
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" activePath={location.pathname} />
//             <NavLink to="/mens-services" icon={<Users className="h-5 w-5" />} text="Men's Services" activePath={location.pathname} />
//             <NavLink to="/womens-services" icon={<Users className="h-5 w-5" />} text="Women's Services" activePath={location.pathname} />
//             <NavLink to="/blogs" icon={<BookOpen className="h-5 w-5" />} text="Blogs" activePath={location.pathname} />
//             <NavLink to="/offers" icon={<Gift className="h-5 w-5" />} text="Offers" activePath={location.pathname} />
//             <NavLink to="/allcertificate" icon={<Gift className="h-5 w-5" />} text="Certificates" activePath={location.pathname} />
//           </div>

//           {/* Right Side: Dashboard & Logout */}
//           <div className="hidden md:flex items-center space-x-4">
//             {profile?.role === "admin" && (
//               <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" activePath={location.pathname} />
//             )}
//             <button
//               onClick={() => handleLogout(navigateTo)}
//               className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 truncate"
//             >
//               <LogOut className="h-5 w-5" />
//               <span className="lg:inline">Logout</span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-gray-700"
//           >
//             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`absolute left-0 w-full bg-white shadow-md p-4 transition-all duration-300 ease-in-out ${
//             isOpen ? "block" : "hidden"
//           }`}
//         >
//           <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" closeMenu={closeMenu} activePath={location.pathname} />
//           <NavLink to="/mens-services" icon={<Users className="h-5 w-5" />} text="Men's Services" closeMenu={closeMenu} activePath={location.pathname} />
//           <NavLink to="/womens-services" icon={<Users className="h-5 w-5" />} text="Women's Services" closeMenu={closeMenu} activePath={location.pathname} />
//           <NavLink to="/blogs" icon={<BookOpen className="h-5 w-5" />} text="Blogs" closeMenu={closeMenu} activePath={location.pathname} />
//           <NavLink to="/offers" icon={<Gift className="h-5 w-5" />} text="Offers" closeMenu={closeMenu} activePath={location.pathname} />
//           <NavLink to="/allcertificate" icon={<Gift className="h-5 w-5" />} text="Certificates" closeMenu={closeMenu} activePath={location.pathname} />

//           {/* Mobile Dashboard & Logout */}
//           {profile?.role === "admin" && (
//             <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" closeMenu={closeMenu} activePath={location.pathname} />
//           )}
//           <button
//             onClick={() => {
//               handleLogout(navigateTo);
//               closeMenu();
//             }}
//             className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
//           >
//             <LogOut className="h-5 w-5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// const NavLink = ({ to, icon, text, closeMenu, activePath }) => {
//   const isActive = activePath === to;
//   return (
//     <Link
//       to={to}
//       onClick={closeMenu}
//       className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
//         isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-100"
//       }`}
//     >
//       {icon}
//       <span>{text}</span>
//     </Link>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Scissors,
  Home,
  Users,
  BookOpen,
  Gift,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { handleLogout, profile } = useAuth();
  const navigateTo = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 ml-4 mr-6">
            <Scissors className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-800">StyleHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home className="h-4 w-4" />} text="Home" activePath={location.pathname} />
            <NavLink to="/mens-services" icon={<Users className="h-4 w-4" />} text="Men's Services" activePath={location.pathname} />
            <NavLink to="/womens-services" icon={<Users className="h-4 w-4" />} text="Women's Services" activePath={location.pathname} />
            <NavLink to="/blogs" icon={<BookOpen className="h-4 w-4" />} text="Blogs" activePath={location.pathname} />
            <NavLink to="/offers" icon={<Gift className="h-4 w-4" />} text="Offers" activePath={location.pathname} />
            <NavLink to="/allcertificate" icon={<Gift className="h-4 w-4" />} text="Certificates" activePath={location.pathname} />
          </div>

          {/* Right Side: Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {profile?.role === "admin" && (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <UserCircle className="h-6 w-6 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                    <NavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} text="Dashboard" closeMenu={() => setDropdownOpen(false)} />
                    {/* <NavLink to="/profile" icon={<UserCircle className="h-4 w-4" />} text="Profile" closeMenu={() => setDropdownOpen(false)} /> */}
                    <button
                      onClick={() => {
                        handleLogout(navigateTo);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`absolute left-0 w-full bg-white shadow-md p-4 transition-all duration-300 ease-in-out ${isOpen ? "block" : "hidden"}`}>
          <NavLink to="/" icon={<Home className="h-4 w-4" />} text="Home" closeMenu={closeMenu} activePath={location.pathname} />
          <NavLink to="/mens-services" icon={<Users className="h-4 w-4" />} text="Men's Services" closeMenu={closeMenu} activePath={location.pathname} />
          <NavLink to="/womens-services" icon={<Users className="h-4 w-4" />} text="Women's Services" closeMenu={closeMenu} activePath={location.pathname} />
          <NavLink to="/blogs" icon={<BookOpen className="h-4 w-4" />} text="Blogs" closeMenu={closeMenu} activePath={location.pathname} />
          <NavLink to="/offers" icon={<Gift className="h-4 w-4" />} text="Offers" closeMenu={closeMenu} activePath={location.pathname} />
          <NavLink to="/allcertificate" icon={<Gift className="h-4 w-4" />} text="Certificates" closeMenu={closeMenu} activePath={location.pathname} />

          {/* Mobile Dashboard & Logout */}
          {profile?.role === "admin" && (
            <NavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} text="Dashboard" closeMenu={closeMenu} activePath={location.pathname} />
          )}
          <button
            onClick={() => {
              handleLogout(navigateTo);
              closeMenu();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, closeMenu, activePath }) => {
  const isActive = activePath === to;
  return (
    <Link
      to={to}
      onClick={closeMenu}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md ${isActive ? "bg-purple-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {icon}
      <span className="whitespace-nowrap">{text}</span>
    </Link>
  );
};

export default Navbar;
