class CommentDTO {
  constructor(comment) {
    this._id = comment._id;
    this.content = comment.content;
    this.blog = comment.blog;
    this.userName = comment.author.userName;
    this.createdAt = comment.createdAt;
  }
}
module.exports = CommentDTO;
