import mongoose from "mongoose";
import { Certificate } from "../models/certificate.model.js";
import fs from "fs";
import path from "path";

export const createCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Certificate image is required" });
    }
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const { title } = req.body;
    const adminName = req.user?.name;
    const adminPhoto = req.user?.photo;
    const createdBy = req.user?._id;
    const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");

    const certificate = await Certificate.create({
      title,
      adminName,
      adminPhoto,
      createdBy,
      photo: imagePath,
    });

    res.status(201).json({ message: "Certificate created successfully", certificate });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.photo) {
      const imagePath = path.join("public", certificate.photo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await certificate.deleteOne();
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

export const getAllCertificates = async (req, res) => {
  const allCertificates = await Certificate.find();
  res.status(200).json(allCertificates);
};

export const getSingleCertificates = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Certificate ID" });
    }

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getMyCertificates = async (req, res) => {
  const createdBy = req.user._id;
  const myCertificates = await Certificate.find({ createdBy });
  res.status(200).json(myCertificates);
};

export const updateCertificate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Certificate ID" });
  }

  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    let updateData = {};

    if (req.body.title) {
      updateData.title = req.body.title;
    }

    if (req.file) {
      const oldImagePath = certificate.photo;
      if (oldImagePath) {
        const oldImageFullPath = path.join("public", oldImagePath);
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlinkSync(oldImageFullPath);
        }
      }
      updateData.photo = req.file.path.replace(/\\/g, "/").replace("public/", "");
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Certificate updated successfully", updatedCertificate });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};
