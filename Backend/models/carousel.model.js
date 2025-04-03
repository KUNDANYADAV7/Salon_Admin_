

import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

export const Carousel = mongoose.model("Carousel", CarouselSchema);
