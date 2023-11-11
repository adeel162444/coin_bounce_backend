const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateAblog,
  deleteAblog,
} = require("../controllers/blogController");
const { verifyToken } = require("../controllers/userController");
const upload = require("../multerConfig");

const blogRouter = express.Router();
blogRouter.route("/new").post(verifyToken, upload.single("image"), createBlog);
blogRouter.route("/all").get(verifyToken, getAllBlogs);
blogRouter.route("/single/:id").get(verifyToken, getBlogById);
blogRouter
  .route("/update")
  .post(verifyToken, upload.single("image"), updateAblog);
blogRouter.route("/delete/:id").delete(verifyToken, deleteAblog);
module.exports = blogRouter;
