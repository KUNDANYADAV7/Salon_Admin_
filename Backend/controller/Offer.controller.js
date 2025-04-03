import mongoose from "mongoose";
import { Offer } from "../models/Offer.model.js";
import fs from "fs";
import path from "path";

// Create Offer
export const createOffer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Offer image is required" });
    }

    const { title, discount, validFrom, validUntil } = req.body;

    if (!title || !validFrom || !validUntil) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const adminName = req.user?.name;
    const adminPhoto = req.user?.photo;
    const createdBy = req.user?._id;

    const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");

    const offer = await Offer.create({
      title,
      discount,
      validFrom,
      validUntil,
      isActive: true,
      adminName,
      adminPhoto,
      createdBy,
      photo: imagePath,
    });

    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Delete Offer
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.photo) {
      const imagePath = path.join("public", offer.photo);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await offer.deleteOne();
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// Get all Active Offers (for frontend display)
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// Get Single Offer
export const getSingleOffers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Offer ID" });
    }

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get Offers Created by Logged-in User
export const getMyOffers = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const myOffers = await Offer.find({ createdBy });
    res.status(200).json(myOffers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// Update Offer
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Offer ID" });
    }

    const { title, discount, validFrom, validUntil } = req.body;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    let updateData = { title, discount, validFrom, validUntil };

    if (req.file) {
      if (offer.photo) {
        const oldImageFullPath = path.join("public", offer.photo);
        if (fs.existsSync(oldImageFullPath)) fs.unlinkSync(oldImageFullPath);
      }
      updateData.photo = req.file.path.replace(/\\/g, "/").replace("public/", "");
    }

    const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Offer updated successfully", updatedOffer });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// Toggle Offer Active/Inactive
export const toggleOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Offer ID" });
    }

    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.status(200).json({ message: `Offer ${offer.isActive ? "Activated" : "Deactivated"} successfully`, offer });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};
