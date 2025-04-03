

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import fileUpload from "express-fileupload";
// import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import cors from "cors";
import carouselRoute from "./routes/carousel.route.js";
import menserviceRoutes  from "./routes/menservice.route.js";
import womenserviceRoutes  from "./routes/womenservice.route.js";
import offerRoutes  from "./routes/Offer.route.js";
import certificateRoutes  from "./routes/certificate.route.js";



dotenv.config();  // ✅ Load .env first

const app = express();
const port = process.env.PORT || 4001;
const MONGO_URL = process.env.MONOG_URI;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    // origin: (origin, callback) => {
    //   callback(null, true); // Accept any origin
    // },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))

// Database Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB "+process.env.PORT))
  .catch((error) => console.log("MongoDB connection error:", error));

// Define routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/carousel", carouselRoute);
app.use("/api/menservices", menserviceRoutes);
app.use("/api/womenservices", womenserviceRoutes)
app.use("/api/offers",offerRoutes)
app.use("/api/certificates",certificateRoutes)


// Start server
app.listen(port, () => {
  console.log(`Server is running`);
});



