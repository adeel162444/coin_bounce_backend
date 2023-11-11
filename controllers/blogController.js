const BlogDTO = require("../dto/blogdto");
const SingleBlogDto = require("../dto/singleBlogDetails");
const { errorMessage, decodedUser } = require("../methods/helpingMethods");
const blogModel = require("../models/blogModel");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const commentModel = require("../models/commentModel");
const { findOne, findByIdAndUpdate } = require("../models/userModel");
const { unlink } = require("fs/promises");
//create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const author = req.user.id;
    const image = req.file;

    if (!title || !description || !image) {
      errorMessage(res, 400, "Please fill out all the details");
    } else {
      const blog = new blogModel({
        title,
        description,
        author,
        imagePath: `${process.env.SERVER_BASE_PATH}/uploads/${image.filename}`,
      });
      await blog.save();
      const blogDto = new BlogDTO(blog);
      res.status(201).json({
        success: true,
        message: "new blog posted",
        blog: blogDto,
      });
    }
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
//get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    const dtoBlogs = [];
    for (let i = 0; i < blogs.length; i++) {
      let dto = new BlogDTO(blogs[i]);
      dtoBlogs.push(dto);
    }
    res.status(200).json({
      success: true,
      blogs: dtoBlogs,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
// get a blog by id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).populate("author");
    const blogDetails = new SingleBlogDto(blog);
    res.status(200).json({
      success: true,
      blog: blogDetails,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};

//update a blog v. important
exports.updateAblog = async (req, res) => {
  try {
    const { blogId, title, description } = req.body;

    // to delete previous photo we need previous photoPth stored in database,
    // fetching that data from database to get imageName and path.
    let blog;
    let updatedBolog;
    try {
      blog = await blogModel.findOne({ _id: blogId });
    } catch (error) {
      errorMessage(res, 500, `${error}`);
    }
    let imageName;

    if (req.file) {
      imageName = blog.imagePath;
      imageName = imageName.split("/").at(-1);
      try {
        // Use fs.unlinkSync for synchronous file deletion
        fs.unlinkSync(`uploads/${imageName}`);
        console.log(`Deleted file: uploads/${imageName}`);
      } catch (error) {
        console.log("Error deleting file:", error);
        // Handle the error
      }

      updatedBolog = await blogModel.findByIdAndUpdate(blogId, {
        title,
        description,
        imagePath: `${process.env.SERVER_BASE_PATH}/uploads/${req.file.filename}`,
      });
    } else {
      updatedBolog = await blogModel.findByIdAndUpdate(blogId, {
        title,
        description,
      });
    }
    console.log(updatedBolog);

    res.status(200).json({
      success: true,
      message: "bolg updated",
      blog: updatedBolog,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
//delete a blog and delete all comments of that blog
exports.deleteAblog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await blogModel.deleteOne({ _id: id });
    const deletedComment = await commentModel.deleteMany({ blog: id });
    res.status(200).json({
      success: true,
      message: "blog deleted successfully",
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
