const express = require("express");
const {
  createComment,
  getComments,
} = require("../controllers/commentController");
const { verifyToken } = require("../controllers/userController");
const commentRouter = express.Router();
commentRouter.route("/create").post(verifyToken, createComment);
commentRouter.route("/get/:id").get(getComments);
module.exports = commentRouter;
