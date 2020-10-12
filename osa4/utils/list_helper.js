
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(sum, 0)
}

const favoriteBlog = (blogs) => {

  const moreLikes = (prev, curr) => {
    return prev.likes > curr.likes
      ? prev
      : curr
  }
  return blogs.reduce(moreLikes, [])
}

/* const mostBlogs = (blogs) => {

} */

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}