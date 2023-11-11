const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    imagePath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const blogModel = mongoose.model("Blog", blogSchema, "blogs");
module.exports = blogModel;
