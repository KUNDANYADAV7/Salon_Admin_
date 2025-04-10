import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import config from "../../config";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true); // Start loading

    try {
      const { data } = await axios.post(
        `${config.apiUrl}/api/users/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!data.token) {
        throw new Error("Login failed. No token received.");
      }

      // Store token and update state
      localStorage.setItem("jwt", data.token);
      setProfile(data.user || {}); // Ensure user data exists
      setIsAuthenticated(true);

      toast.success(data.message || "Login successful");

      // Reset form fields
      setEmail("");
      setPassword("");

      // Navigate immediately
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleLogin}>
          <h1 className="text-xl font-semibold mb-6 text-center">Login</h1>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading} // Disable input while loading
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading} // Disable input while loading
            />
          </div>

          <p className="text-center mb-4">
            New User?{" "}
            <Link to={"/register"} className="text-blue-600">
              Register Now
            </Link>
          </p>

          <p className="text-center mb-4">
            <Link to="/forgot-password" className="text-red-500">
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login



// import axios from "axios";
// import React, { useState, useCallback } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthProvider";
// import config from "../../config";

// const Login = () => {
//   const { setIsAuthenticated, setProfile } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const { email, password } = form;

//       if (!email || !password) {
//         toast.error("Please fill in all required fields");
//         return;
//       }

//       setLoading(true);

//       try {
//         const { data } = await axios.post(
//           `${config.apiUrl}/api/users/login`,
//           form,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         if (!data.token) throw new Error("No token received");

//         localStorage.setItem("jwt", data.token);
//         setProfile(data.user || {});
//         setIsAuthenticated(true);
//         toast.success(data.message || "Login successful");

//         setForm({ email: "", password: "" });
//         navigate("/");
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Login failed.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [form, navigate, setIsAuthenticated, setProfile]
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
//         <form onSubmit={handleLogin}>
//           <h1 className="text-xl font-semibold mb-6 text-center">Login</h1>

//           {["email", "password"].map((field) => (
//             <div key={field} className="mb-4">
//               <input
//                 type={field === "email" ? "email" : "password"}
//                 name={field}
//                 value={form[field]}
//                 onChange={handleChange}
//                 placeholder={
//                   field === "email" ? "Your Email Address" : "Your Password"
//                 }
//                 className="w-full p-2 border rounded-md"
//                 disabled={loading}
//                 autoFocus={field === "email"}
//               />
//             </div>
//           ))}

//           <div className="text-center mb-4">
//             New User?{" "}
//             <Link to="/register" className="text-blue-600">
//               Register Now
//             </Link>
//           </div>

//           <div className="text-center mb-4">
//             <Link to="/forgot-password" className="text-red-500">
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             className={`w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
