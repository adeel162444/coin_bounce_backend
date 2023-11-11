class SingleBlogDto {
  constructor(blog) {
    this._id = blog._id;
    this.title = blog.title;
    this.description = blog.description;
    this.imagePath = blog.imagePath;
    this.createdAt = blog.createdAt;
    this.userName = blog.author.userName;
    this.name = blog.author.name;
  }
}
module.exports = SingleBlogDto;
