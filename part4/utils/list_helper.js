var _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((currentFavoriteBlog, blog) => {
    return currentFavoriteBlog.likes > blog.likes ? currentFavoriteBlog : blog
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = _.countBy(blogs, (blog) => blog.author)
  const sortedAuthorCounts = _.chain(authorCounts)
    .map((count, author) => {
      return { author: author, blogs: count }
    })
    .sortBy("blogs")
    .value()

  return _.last(sortedAuthorCounts)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
