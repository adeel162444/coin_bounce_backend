const CommentDTO = require("../dto/commentDto");
const { errorMessage, decodedUser } = require("../methods/helpingMethods");
const commentModel = require("../models/commentModel");
const userModel = require("../models/userModel");
//Add a comment
exports.createComment = async (req, res) => {
  const { content, blogId } = req.body;
  try {
    const author = req.user.id;

    const comment = new commentModel({
      content,
      author,
      blog: blogId,
    });
    await comment.save();
    const commentDto = new CommentDTO(comment);
    res.status(201).json({
      success: true,
      message: "comment successfully added",
      comment: commentDto,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
// get the comments related to a blog
exports.getComments = async (req, res) => {
  const blogId = req.params.id;
  try {
    const comments = await commentModel
      .find({ blog: blogId })
      .populate("author");
    const dtoComments = [];
    for (let i = 0; i < comments.length; i++) {
      const dto = new CommentDTO(comments[i]);
      dtoComments.push(dto);
    }
    res.status(200).json({
      success: true,
      comments: dtoComments,
    });
  } catch (error) {
    errorMessage(res, 500, `${error}`);
  }
};
