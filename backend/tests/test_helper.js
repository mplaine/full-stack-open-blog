const User = require('../models/user')
const Blog = require('../models/blog')


const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'topsecret',
  },
  {
    username: 'teverts',
    name: 'Tammy Everts',
    password: 'ymmat',
  },
  {
    username: 'ccrocker',
    name: 'Cliff Crocker',
    password: 'ffilc',
  },
]

const initialBlogs = [
  {
    title: 'Performance audit: Lego.com',
    author: 'Tammy Everts',
    url: 'https://www.speedcurve.com/blog/web-performance-audit-lego/',
    likes: 5,
  },
  {
    title: 'NEW! December product update',
    author: 'Cliff Crocker',
    url: 'https://www.speedcurve.com/blog/december-2023-update/',
    likes: 99,
  },
  {
    title: 'Mobile INP performance: The elephant in the room',
    author: 'Cliff Crocker',
    url: 'https://www.speedcurve.com/blog/core-web-vitals-inp-mobile/',
    likes: 2,
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialUsers,
  usersInDb,
  initialBlogs,
  blogsInDb,
}
