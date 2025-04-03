import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    photo: { type: String, required: true },
    adminName: {
      type: String,
    },
    adminPhoto: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
