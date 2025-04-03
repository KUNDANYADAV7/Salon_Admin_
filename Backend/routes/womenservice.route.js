import express from "express";
import {
  createWomenService,
  deleteWomenService,
  getAllWomenService,
  getMyWomenService,
  getSingleWomenService,
  updateWomenService,
  getWomenServicesBySubTitle,
  getWomenServicesWithoutCategory,
  deleteWomenServiceBySubtitle
} from "../controller/womenservice.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import { upload, setUploadFolder } from "../middleware/Multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"),setUploadFolder("womenservice"), upload.single("womenimage"), createWomenService);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteWomenService);
router.delete("/delete-subtitle/:subTitle", isAuthenticated, isAdmin("admin"), deleteWomenServiceBySubtitle);
router.get("/all-womenservices", getAllWomenService);
// router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
router.get("/single-womenservice/:identifier", isAuthenticated, getSingleWomenService);
router.get("/my-womenservices", isAuthenticated, isAdmin("admin"), getMyWomenService);
router.put("/update/:id", isAuthenticated, isAdmin("admin"),setUploadFolder("womenservice"), upload.single("womenimage"), updateWomenService);


router.get("/single-womenservice/slug/:slug", getSingleWomenService);

router.get("/womenservices/:subTitle", getWomenServicesBySubTitle);
router.get("/no-category", getWomenServicesWithoutCategory);

export default router;
