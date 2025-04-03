import express from "express";
import {
  createMenService,
  deleteMenService,
  getAllMenService,
  getMyMenService,
  getSingleMenService,
  updateMenService,
  getMenServicesBySubTitle,
  getMenServicesWithoutCategory,
  deleteMenServiceBySubtitle
} from "../controller/menservice.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import { upload, setUploadFolder } from "../middleware/Multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"),setUploadFolder("menservice"), upload.single("menimage"), createMenService);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteMenService);
router.delete("/delete-subtitle/:subTitle", isAuthenticated, isAdmin("admin"), deleteMenServiceBySubtitle);
router.get("/all-menservices", getAllMenService);
// router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
// router.get("/single-menservice/slug/:slug", isAuthenticated, getSingleMenService);
router.get("/single-menservice/:identifier", isAuthenticated, getSingleMenService);

router.get("/my-menservices", isAuthenticated, isAdmin("admin"), getMyMenService);
router.put("/update/:id", isAuthenticated, isAdmin("admin"),setUploadFolder("menservice"), upload.single("menimage"), updateMenService);


router.get("/single-menservice/slug/:slug", getSingleMenService);

router.get("/menservices/:subTitle", getMenServicesBySubTitle);
router.get("/no-category", getMenServicesWithoutCategory);

export default router;
