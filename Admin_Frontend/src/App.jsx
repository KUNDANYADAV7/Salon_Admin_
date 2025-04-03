import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MensServices from './pages/publicservices/MensServices';
import WomensServices from './pages/publicservices/WomensServices';
import Blogs from './pages/Blogs';
import Offers from './pages/Offers';
import DashboardLayout from './components/DashboardLayout';
import Profile from './pages/dashboard/Profile';
import AllMensServices from './pages/dashboard/AllMensServices';
import CreateMensService from './pages/dashboard/CreateMensService';
import AllWomensServices from './pages/dashboard/AllWomensServices';
import CreateWomensService from './pages/dashboard/CreateWomensService';
import AllBlogs from './pages/dashboard/AllBlogs';
import CreateBlog from './pages/dashboard/CreateBlog';
import AllOffers from './pages/dashboard/AllOffers';
import CreateOffer from './pages/dashboard/CreateOffer';
import Detail from './pages/Detail';
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import MenSelectedServices from './pages/dashboard/MenSelectedService/MenSelectedServices';
import WomenSelectedServices from './pages/dashboard/WomenSelectedService.jsx/WomenSelectedServices';
import CreateCert from './pages/dashboard/Certificate/CreateCert';
import AllCert from './pages/dashboard/Certificate/AllCert';
import AllCertificates from './pages/AllCertificates';
import AllCertificateDetail from './pages/AllCertificateDetail';
import HomeWomenSelectedSer from './pages/publicservices/HomeWomenSelectedSer';
import HomeMenSelectSer from './pages/publicservices/HomeMenSelectSer';
import OfferDetail from './pages/OfferDetail';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-white">
        <Routes>
          
               {/* Public Routes - Only accessible if NOT logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset_password/:id/:token" element={<ResetPassword />} />
          </Route>




              {/* Protected Routes - Only accessible if LOGGED IN */}
              <Route element={<ProtectedRoute />}>
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/mens-services" element={<><Navbar /><MensServices /></>} />
          <Route path="/womens-services" element={<><Navbar /><WomensServices /></>} />
          <Route path="/blogs" element={<><Navbar /><Blogs /></>} />
          <Route path="/offers" element={<><Navbar /><Offers /></>} />
          <Route path="/offerdetail/:id" element={<><Navbar /><OfferDetail /></>} />
          <Route path='/blog/:slug' element={<><Navbar /><Detail /></>} />
          <Route path='/allcertificate' element={<><Navbar /><AllCertificates /></>} />
          <Route path='/allcertificate/:id' element={<><Navbar /><AllCertificateDetail /></>} />

          <Route path='/home-women-service/:subTitle' element={<><Navbar /><HomeWomenSelectedSer /></>} />
          <Route path='/home-men-service/:subTitle' element={<><Navbar /><HomeMenSelectSer /></>} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Profile />} />
            <Route path="men's-services" element={<AllMensServices />} />
            <Route path="men's-services/:subTitle" element={<MenSelectedServices />} />
            <Route path="mens-services/create/:id?" element={<CreateMensService />} />
            <Route path="women's-services" element={<AllWomensServices />} />
            <Route path="women's-services/:subTitle" element={<WomenSelectedServices />} />
            <Route path="womens-services/create/:id?" element={<CreateWomensService />} />
            <Route path="blogs" element={<AllBlogs />} />
            <Route path="blogs/create/:id?/:slug?" element={<CreateBlog />} />
            <Route path="offers" element={<AllOffers />} />
            <Route path="offer's/create/:id?" element={<CreateOffer />} />
            <Route path="certs" element={<AllCert />} />
            <Route path="cert/create/:id?" element={<CreateCert />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;