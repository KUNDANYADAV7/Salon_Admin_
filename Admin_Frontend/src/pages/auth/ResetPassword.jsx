import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import toast, { Toaster } from "react-hot-toast";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${config.apiUrl}/api/users/reset-password/${id}/${token}`,
        { password }
      );

      if (res.data.Status === "Success") {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          toast.error("Token has expired or is invalid.");
        } else if (err.response.status === 404) {
          toast.error("User not found.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Server not responding.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              autoComplete="off"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-300"
          >
            Update Password
          </button>
          <div className="flex justify-center mt-4">
          <Link to='/forgot-password' className="text-blue-600 hover:underline ">Back to Forgot Passsword</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
