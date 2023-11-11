const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    blog: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Blog",
    },
  },
  {
    timestamps: true,
  }
);
const commentModel = mongoose.model("Comment", commentSchema, "comments");
module.exports = commentModel;
