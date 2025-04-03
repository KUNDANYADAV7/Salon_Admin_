import mongoose from "mongoose";
import { Carousel } from "../models/carousel.model.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";


export const createCarouselItem = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Carousel image is required" });
    }

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(403).json({ message: "Unauthorized: No user found" });
    }

    const imageFile = req.files.image;
    const uploadResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      folder: "carousel-images",
    });

    const newItem = await Carousel.create({
      title,
      description,
      image: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      },
      createdBy: req.user._id, // Store admin ID
    });

    res.status(201).json({ message: "Carousel item created successfully", newItem });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};




export const getAllCarouselItems = async (req, res) => {
  try {
    const items = await Carousel.find().populate("createdBy", "name email"); // Fetch admin's name and email
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get a single carousel item
export const getCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const item = await Carousel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMyCarousels = async (req, res) => {
  const createdBy = req.user._id;
  const myCarousels = await User.find({ createdBy });
  res.status(200).json(myCarousels);
};

// Update a carousel item (deletes old image and uploads a new one)
export const updateCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const item = await Carousel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    let imageUpdate = item.image; // Default: Keep the old image

    if (req.files && req.files.image) {
      // Delete old image from Cloudinary
      if (item.image && item.image.public_id) {
        await cloudinary.uploader.destroy(item.image.public_id);
      }

      // Upload new image to Cloudinary inside 'carousel-images' folder
      const uploadResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "carousel-images",
      });

      imageUpdate = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      };
    }

    // Update the carousel item
    const updatedItem = await Carousel.findByIdAndUpdate(
      id,
      { title, description, image: imageUpdate },
      { new: true }
    );

    res.status(200).json({ message: "Carousel item updated successfully", updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a carousel item (also removes the image from Cloudinary)
export const deleteCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const item = await Carousel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete the image from Cloudinary
    if (item.image && item.image.public_id) {
      await cloudinary.uploader.destroy(item.image.public_id);
    }

    // Delete the item from the database
    await item.deleteOne();

    res.status(200).json({ message: "Carousel item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
