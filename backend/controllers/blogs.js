const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const retrievedBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(retrievedBlogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })

  const createdBlog = await blog.save()
  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()
  response.status(201).json(createdBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blogToBeDeleted = await Blog.findById(request.params.id)
  if (blogToBeDeleted) {
    if (blogToBeDeleted.user.toString() !== user.id) {
      return response.status(401).json({ error: 'Invalid user' })
    }

    const deleteResponse = await Blog.deleteOne({ _id: request.params.id })
    if (deleteResponse.deletedCount === 1) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = new Blog(request.body)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    const comment = request.body.comment
    blog.comments = blog.comments.concat(comment)
    await blog.save()
    response.status(201).json(comment)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
