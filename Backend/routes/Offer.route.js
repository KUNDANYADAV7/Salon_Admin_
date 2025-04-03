import express from "express";
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getMyOffers,
  getSingleOffers,
  updateOffer,
  toggleOfferStatus
} from "../controller/Offer.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";
import { upload, setUploadFolder } from "../middleware/Multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"),setUploadFolder("offerImages"), upload.single("offerImage"), createOffer);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteOffer);
router.get("/all-offers", getAllOffers);
// router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
router.get("/single-offer/:id", isAuthenticated, getSingleOffers);
router.get("/my-offer", isAuthenticated, isAdmin("admin"), getMyOffers);
router.put("/update/:id", isAuthenticated, isAdmin("admin"),setUploadFolder("offerImages"), upload.single("offerImage"), updateOffer);

router.put("/toggle-status/:id", isAuthenticated, isAdmin("admin"),setUploadFolder("offerImages"), upload.single("offerImage"), toggleOfferStatus);


router.get("/single-offers/:id", getSingleOffers);

export default router;
