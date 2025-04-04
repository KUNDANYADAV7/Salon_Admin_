import { MenService } from '../models/menservice.model.js'
import mongoose from "mongoose";
import slugify from "slugify";
import fs from "fs";
import path from "path";


export const createMenService = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Men Service Image is required" });
    }

    const { title, subTitle, category, description, duration, price } = req.body; // Include duration and price
    if (!title || !subTitle || !description) {
      return res.status(400).json({ message: "Title, subTitle & description are required fields" });
    }

    const adminName = req.user?.name;
    const adminPhoto = req.user?.photo;
    const createdBy = req.user?._id;

       // Check if the same subTitle already exists without a category
       const existingServiceWithoutCategory = await MenService.findOne({ subTitle, category: { $exists: false } });

       if (!category && existingServiceWithoutCategory) {
         return res.status(400).json({ message: `Men Service with subTitle '${subTitle}' already exists without a category` });
       }
   
       // Check if the same subTitle + category combination already exists
       if (category) {
         const existingServiceWithCategory = await MenService.findOne({ subTitle, category });
   
         if (existingServiceWithCategory) {
           return res.status(400).json({ message: `Men Service with subTitle '${subTitle}' and category '${category}' already exists` });
         }
       }
   
       // Generate unique slug
       let slug = slugify(title, { lower: true, strict: true });
       let existingSlug = await MenService.findOne({ slug });
       let count = 1;
       while (existingSlug) {
         slug = slugify(`${title}-${count}`, { lower: true, strict: true });
         existingSlug = await MenService.findOne({ slug });
         count++;
       }
    const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");

    const menservice = await MenService.create({
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

    res.status(201).json({ message: "Men Service created successfully", menservice });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};





export const deleteMenService = async (req, res) => {
  const { id } = req.params;

  try {
    const menservice = await MenService.findById(id);
    if (!menservice) {
      return res.status(404).json({ message: "Men Service not found" });
    }

    // Remove associated image if it exists
    if (menservice.photo) {
      const imagePath = path.join("public", menservice.photo); // Ensure full path
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image
      }
    }

    await menservice.deleteOne();
    res.status(200).json({ message: "Men Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};




export const deleteMenServiceBySubtitle = async (req, res) => {
  const { subTitle } = req.params; // Get subtitle from request params

  try {
    // Find all services matching the subtitle (case-insensitive)
    const menservices = await MenService.find({ subTitle: new RegExp(`^${subTitle}$`, "i") });

    if (menservices.length === 0) {
      return res.status(404).json({ message: "No Men Services found with this subtitle" });
    }

    // Loop through each found document and delete associated images
    menservices.forEach((service) => {
      if (service.photo) {
        const imagePath = path.join("public", service.photo); // Ensure full path
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image
        }
      }
    });

    // Delete all matching services at once
    await MenService.deleteMany({ subTitle: new RegExp(`^${subTitle}$`, "i") });

    res.status(200).json({ message: "All Men Services with this subtitle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};


export const getAllMenService = async (req, res) => {
  const allmenservices = await MenService.find();
  res.status(200).json(allmenservices);
};



export const getSingleMenService = async (req, res) => {
  try {
    const { identifier } = req.params;
    let menservice;

    // Check if identifier is a valid MongoDB ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      menservice = await MenService.findById(identifier);
    } else {
      menservice = await MenService.findOne({ slug: identifier });
    }

    if (!menservice) {
      return res.status(404).json({ message: "Men Service not found" });
    }

    res.status(200).json(menservice);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const getMyMenService = async (req, res) => {
  const createdBy = req.user._id;
  const mymenServices = await MenService.find({ createdBy });
  res.status(200).json(mymenServices);
};



// hdwjkdikdkdhdwkdw

export const updateMenService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Men Service ID" });
  }

  try {
    const { title, subTitle, category, description, duration, price } = req.body;

    if (!title || !subTitle || !description) {
      return res.status(400).json({ message: "Title, subTitle & description are required fields" });
    }

    const menService = await MenService.findById(id);
    if (!menService) {
      return res.status(404).json({ message: "Men Service not found" });
    }

    // **Validation: Prevent same subTitle without category**
    if (!category) {
      const existingServiceWithoutCategory = await MenService.findOne({
        subTitle,
        category: { $exists: false },
        _id: { $ne: id }, // Exclude the current service being updated
      });

      if (existingServiceWithoutCategory) {
        return res.status(400).json({
          message: `Men Service with subTitle '${subTitle}' already exists without a category`,
        });
      }
    }

    // **Validation: Prevent same subTitle + category combination**
    if (category) {
      const existingServiceWithCategory = await MenService.findOne({
        subTitle,
        category,
        _id: { $ne: id }, // Exclude the current service being updated
      });

      if (existingServiceWithCategory) {
        return res.status(400).json({
          message: `Men Service with subTitle '${subTitle}' and category '${category}' already exists`,
        });
      }
    }

    // **Update Slug Only If Title Changes**
    let slug = menService.slug;
    if (title !== menService.title) {
      slug = slugify(title, { lower: true, strict: true });

      // Ensure slug uniqueness
      let existingSlug = await MenService.findOne({ slug });
      let count = 1;
      while (existingSlug) {
        slug = slugify(`${title}-${count}`, { lower: true, strict: true });
        existingSlug = await MenService.findOne({ slug });
        count++;
      }
    }

    let updateData = { title, subTitle, category, description, slug, duration, price };

    // **Handle Image Update**
    if (req.file) {
      // Delete old image
      if (menService.photo) {
        const oldImageFullPath = path.join("public", menService.photo);
        if (fs.existsSync(oldImageFullPath)) {
          fs.unlinkSync(oldImageFullPath);
        }
      }

      updateData.photo = req.file.path.replace(/\\/g, "/").replace("public/", "");
    }

    const updatedMenService = await MenService.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Men Service updated successfully", updatedMenService });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};


export const getMenServicesBySubTitle = async (req, res) => {
  try {
    const  subTitle  = decodeURIComponent(req.params.subTitle);

    if (!subTitle) {
      return res.status(400).json({ message: "SubTitle is required" });
    }

    // Convert dashes (-) back to spaces before querying the database
    // subTitle = subTitle.replace(/-/g, " ");

    // Fetch only services where category is present (not null or undefined)
    const menServices = await MenService.find({ subTitle, category: { $exists: true, $ne: null } });

    if (menServices.length === 0) {
      // return res.status(404).json({ message: "No services found for this subTitle with a category" });
      return res.status(200).json([]); // ✅ Return empty array instead of 404
    }

    res.status(200).json(menServices);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};




export const getMenServicesWithoutCategory = async (req, res) => {
  try {

    const services = await MenService.find({ category: { $exists: false } });


    if (services.length === 0) {
      return res.status(404).json({ message: "No services found without a category" });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};












