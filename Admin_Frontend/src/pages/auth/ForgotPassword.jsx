import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      `${config.apiUrl}/api/users/forgot-password`,
      { email },
    );


    if (res.data?.Status?.toLowerCase() === "success" || res.data?.status?.toLowerCase() === "success") {
      toast.success(res.data.message || "Password reset link sent!");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      toast.error(res.data.message || "Invalid user, user not found!");
    }
  } catch (err) {
    // console.error("Error:", err);

    // Handle specific API error responses
    if (err.response && err.response.data) {
      toast.error(err.response.data.message || "Invalid user, user not found!");
    } else {
      toast.error("Something went wrong. Please try again!");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
        {/* Company Logo */}
        <div className="flex justify-center mb-4">
          <img src="LG.jpg" alt="Company Logo" className="h-16" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-2">Forgot your password</h2>
        <p className="text-gray-600 mb-4">
          Please enter the email address you'd like your password reset information sent to.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md text-center"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Request reset link'}
          </button>
        </form>

        {/* Back to Login */}
        <p className="mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
