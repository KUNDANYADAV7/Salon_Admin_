import express from "express";
import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getMyCertificates,
  getSingleCertificates,
  updateCertificate,
} from "../controller/certificate.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import { upload, setUploadFolder } from "../middleware/Multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"),setUploadFolder("certificateImages"), upload.single("certificateImage"), createCertificate);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteCertificate);
router.get("/all-certificates", getAllCertificates);
// router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
router.get("/single-certificate/:id", isAuthenticated, getSingleCertificates);
router.get("/my-certificates", isAuthenticated, isAdmin("admin"), getMyCertificates);
router.put("/update/:id", isAuthenticated, isAdmin("admin"),setUploadFolder("certificateImages"), upload.single("certificateImage"), updateCertificate);


router.get("/single-certificates/:id", getSingleCertificates);

export default router;
