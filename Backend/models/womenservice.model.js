import mongoose from "mongoose";

const WomenServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true,},
    subTitle: { type: String, required: true },
    category: { type: String, required: false },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: false }, // Added duration
    price: { type: Number, required: false }, // Added price
    adminName: { type: String,},
    adminPhoto: { type: String,},
    createdBy: { type: mongoose.Schema.ObjectId,ref: "User",},
  },
  { timestamps: true }
);

export const WomenService = mongoose.model("WomenService", WomenServiceSchema);

