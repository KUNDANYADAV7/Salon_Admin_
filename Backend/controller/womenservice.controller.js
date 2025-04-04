import { WomenService } from '../models/womenservice.model.js'
import mongoose from "mongoose";
import slugify from "slugify";
import fs from "fs";
import path from "path";


export const createWomenService = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Women Service Image is required" });
    }

    const { title, subTitle, category, description, duration, price  } = req.body;
    if (!title || !subTitle || !description) {
      return res.status(400).json({ message: "Title, subTitle & description are required fields" });
    }

    const adminName = req.user?.name;
    const adminPhoto = req.user?.photo;
    const createdBy = req.user?._id;

    // Check if the same subTitle already exists without a category (handling null correctly)
    const existingServiceWithoutCategory = await WomenService.findOne({
      subTitle,
      $or: [{ category: null }, { category: { $exists: false } }]
    });

    if (!category && existingServiceWithoutCategory) {
      return res.status(400).json({ message: `Women Service with subTitle '${subTitle}' already exists without a category` });
    }

    // Check if the same subTitle + category combination already exists
    if (category) {
      const existingServiceWithCategory = await WomenService.findOne({ subTitle, category });

      if (existingServiceWithCategory) {
        return res.status(400).json({ message: `Women Service with subTitle '${subTitle}' and category '${category}' already exists` });
      }
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    let existingSlug = await WomenService.findOne({ slug });
    let count = 1;
    while (existingSlug) {
      slug = slugify(`${title}-${count}`, { lower: true, strict: true });
      existingSlug = await WomenService.findOne({ slug });
      count++;
    }

    // Store image path
    const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");

    const womenservice = await WomenService.create({
      title,
      slug,
      subTitle,
      category,
      description,
      duration, // Save duration
      price, // Save price
      adminName,
      adminPhoto,
      createdBy,
      photo: imagePath,
    });

    res.status(201).json({ message: "Women Service created successfully", womenservice });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};






export const deleteWomenService = async (req, res) => {
  const { id } = req.params;

  try {
    const womenservice = await WomenService.findById(id);
    if (!womenservice) {
      return res.status(404).json({ message: "Women Service not found" });
    }

    // Remove associated image if it exists
    if (womenservice.photo) {
      const imagePath = path.join("public", womenservice.photo); // Ensure full path
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image
      }
    }

    await womenservice.deleteOne();
    res.status(200).json({ message: "Women Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

export const deleteWomenServiceBySubtitle = async (req, res) => {
  const { subTitle } = req.params; // Get subtitle from request params

  try {
    // Find all services matching the subtitle (case-insensitive)
    const womenservices = await WomenService.find({ subTitle: new RegExp(`^${subTitle}$`, "i") });

    if (womenservices.length === 0) {
      return res.status(404).json({ message: "No Men Services found with this subtitle" });
    }

    // Loop through each found document and delete associated images
    womenservices.forEach((service) => {
      if (service.photo) {
        const imagePath = path.join("public", service.photo); // Ensure full path
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image
        }
      }
    });

    // Delete all matching services at once
    await WomenService.deleteMany({ subTitle: new RegExp(`^${subTitle}$`, "i") });

    res.status(200).json({ message: "All Women Services with this subtitle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};


export const getAllWomenService = async (req, res) => {
  const allwomenservices = await WomenService.find();
  res.status(200).json(allwomenservices);
};

export const getSingleWomenService = async (req, res) => {
  try {
    const { identifier } = req.params;
    let womenservice;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      womenservice = await WomenService.findById(identifier);
    } else {
      womenservice = await WomenService.findOne({ slug: identifier });
    }

    if (!womenservice) {
      return res.status(404).json({ message: "Women Service not found" });
    }

    res.status(200).json(womenservice);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



export const getMyWomenService = async (req, res) => {
  const createdBy = req.user._id;
  const mywomenServices = await WomenService.find({ createdBy });
  res.status(200).json(mywomenServices);
};



export const updateWomenService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Women Service ID" });
  }

  try {
    const { title, subTitle, category ,description, duration, price} = req.body;
    if (!title || !subTitle || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const womenService = await WomenService.findById(id);
    if (!womenService) {
      return res.status(404).json({ message: "womenService not found" });
    }


     // **Validation: Prevent same subTitle without category**
        if (!category) {
          const existingServiceWithoutCategory = await WomenService.findOne({
            subTitle,
            category: { $exists: false },
            _id: { $ne: id }, // Exclude the current service being updated
          });
    
          if (existingServiceWithoutCategory) {
            return res.status(400).json({
              message: `Women Service with subTitle '${subTitle}' already exists without a category`,
            });
          }
        }
    
        // **Validation: Prevent same subTitle + category combination**
        if (category) {
          const existingServiceWithCategory = await WomenService.findOne({
            subTitle,
            category,
            _id: { $ne: id }, // Exclude the current service being updated
          });
    
          if (existingServiceWithCategory) {
            return res.status(400).json({
              message: `Women Service with subTitle '${subTitle}' and category '${category}' already exists`,
            });
          }
        }
    
        // **Update Slug Only If Title Changes**
        let slug = WomenService.slug;
        if (title !== WomenService.title) {
          slug = slugify(title, { lower: true, strict: true });
    
          // Ensure slug uniqueness
          let existingSlug = await WomenService.findOne({ slug });
          let count = 1;
          while (existingSlug) {
            slug = slugify(`${title}-${count}`, { lower: true, strict: true });
            existingSlug = await WomenService.findOne({ slug });
            count++;
          }
        }

    let updateData = {
      title,
      subTitle,
      category,
      description,
      slug, 
      duration, 
      price
      // slug: slugify(title, { lower: true, strict: true }),
    };

    // If new image is uploaded, delete the old one and replace it
    if (req.file) {
      const oldImagePath = womenService.photo;

      if (oldImagePath) {
        const oldImageFullPath = path.join("public", oldImagePath); // Ensure full path
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlinkSync(oldImageFullPath); // Delete previous image
        }
      }

      updateData.photo = req.file.path.replace(/\\/g, "/").replace("public/", "");
    }

    const updatedWomenService = await WomenService.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Women Service updated successfully", updatedWomenService });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

export const getWomenServicesBySubTitle = async (req, res) => {
  try {
    const { subTitle } = req.params;

    if (!subTitle) {
      return res.status(400).json({ message: "SubTitle is required" });
    }

    const womenServices = await WomenService.find({ subTitle, category: { $exists: true, $ne: null } });

    if (womenServices.length === 0) {
      // return res.status(404).json({ message: "No services found for this subTitle" });
      return res.status(200).json([]); // ✅ Return empty array instead of 404
    }

    res.status(200).json(womenServices);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};






export const getWomenServicesWithoutCategory = async (req, res) => {
  try {

    const services = await WomenService.find({ category: { $exists: false } });


    if (services.length === 0) {
      return res.status(404).json({ message: "No services found without a category" });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};












