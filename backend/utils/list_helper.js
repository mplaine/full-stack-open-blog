const _ = require('lodash')


const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.sort((a, b) => (b.likes - a.likes))[0]
}

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? null
    : _(blogs)
      .groupBy(blog => blog.author)
      .map((items, author) => {
        return {
          author: author,
          count: items.length,
        }
      })
      .sortBy('count')
      .reverse()
      .first()
      .author
}

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? null
    : _(blogs)
      .groupBy(blog => blog.author)
      .map((items, author) => {
        return {
          author: author,
          likes: items.reduce((sum, blog) => sum + blog.likes, 0),
        }
      })
      .sortBy('likes')
      .reverse()
      .first()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
