class BlogDTO {
  constructor(blog) {
    this._id = blog._id;
    this.title = blog.title;
    this.description = blog.description;
    this.imagePath = blog.imagePath;
    this.author = blog.author;
  }
}
module.exports = BlogDTO;
