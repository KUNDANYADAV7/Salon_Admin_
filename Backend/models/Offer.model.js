import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    discount: { type: String, default: null }, // Optional
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true }, // Default is active
    photo: { type: String, required: true },
    adminName: { type: String },
    adminPhoto: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);
