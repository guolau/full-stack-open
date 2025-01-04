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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
