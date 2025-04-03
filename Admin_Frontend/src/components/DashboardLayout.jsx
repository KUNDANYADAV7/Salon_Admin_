import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Scissors,
  BookOpen,
  Gift,
  LogOut,
  Plus,
  List,
  Home,
  Menu
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const DashboardLayout = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);



  const isActive = (path) => {
    const dynamicPaths = [
      "/dashboard/men's-services",
      "/dashboard/women's-services",
      "/dashboard/blogs/create",
      "/dashboard/cert/create",
      "/dashboard/mens-services/create",
      "/dashboard/womens-services/create",
      "/dashboard/offer's/create",
    ];
  
    return dynamicPaths.some((p) => path.startsWith(p) && location.pathname.includes(p))
      ? "bg-purple-500 text-white"
      : location.pathname === path
      ? "bg-purple-500 text-white"
      : "text-gray-600 hover:bg-gray-200";
  };
  
  
  
  



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-64 bg-white shadow-lg overflow-y-auto h-full absolute md:relative z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">StyleHub</span>
            </Link>
            <button className="md:hidden" onClick={toggleSidebar}>
              ✖
            </button>
          </div>

          <nav className="space-y-1">
            {[  
              { path: "/", label: "Home", icon: Home },
              { path: "/dashboard", label: "My Profile", icon: User },
              { path: "/dashboard/men's-services", label: "Men's Services", icon: List },
              { path: "/dashboard/mens-services/create", label: "Create Men's Service", icon: Plus },
              { path: "/dashboard/women's-services", label: "Women's Services", icon: List },
              { path: "/dashboard/womens-services/create", label: "Create Women's Service", icon: Plus },
              { path: "/dashboard/blogs", label: "All Blogs", icon: BookOpen },
              { path: "/dashboard/blogs/create", label: "Create Blog", icon: Plus },
              { path: "/dashboard/offers", label: "All Offers", icon: Gift },
              { path: "/dashboard/offer's/create", label: "Create Offer", icon: Plus },
              { path: "/dashboard/certs", label: "All Certificates", icon: Gift },
              { path: "/dashboard/cert/create", label: "Create Certificate", icon: Plus },
            ].map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 p-3 rounded-md ${isActive(
                  path
                )}`}
                onClick={closeSidebar}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout(navigateTo);
                closeSidebar();
              }}
              className="flex items-center space-x-2 p-3 rounded-md text-red-600 hover:bg-red-50 w-full mt-8"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 flex items-center md:hidden">
          <button onClick={toggleSidebar} className="text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
