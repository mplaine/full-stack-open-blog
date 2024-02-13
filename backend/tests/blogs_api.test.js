const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000) // 30 seconds
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const testTimeoutMS = 20000 // 20 seconds
const User = require('../models/user')
const Blog = require('../models/blog')
const _ = require('lodash')

beforeEach(async () => {
  // Delete existing users and blogs
  await User.deleteMany({})
  await Blog.deleteMany({})

  // Insert new users
  const users = helper.initialUsers
  for (let user of users) {
    await api.post('/api/users').send(user)
  }

  // Get the first user
  const firstUser = _.first(users)

  // Login the user and get the token
  const loginResponse = await api.post('/api/login').send(firstUser)
  const token = loginResponse.body.token

  // Insert new blogs
  for (let blog of helper.initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(blog)
  }
}, testTimeoutMS)

describe('when there is initially some blogs saved', () => {
  test(
    'blogs are returned as json',
    async () => {
      // Get all blogs
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    },
    testTimeoutMS
  )

  test(
    'all blogs are returned',
    async () => {
      // Get all blogs
      const blogs = await helper.blogsInDb()

      expect(blogs).toHaveLength(helper.initialBlogs.length)
    },
    testTimeoutMS
  )

  test(
    'each blog has "id"',
    async () => {
      // Get all blogs
      const blogs = await helper.blogsInDb()

      // Iterate over blogs
      blogs.forEach((blog) => {
        expect(blog.id).toBeDefined()
        // expect(blog).toHaveProperty('id')
      })
    },
    testTimeoutMS
  )
})

describe('addition of a new blog', () => {
  test(
    'succeeds with valid data',
    async () => {
      // Get the first user
      const firstUser = _.first(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Create a new blog object
      const newBlog = {
        title: 'How to automatically performance test your pull requests and fight regressions',
        author: 'Joseph Wynn',
        url: 'https://www.speedcurve.com/blog/web-performance-test-pull-requests/',
        likes: 1
      }

      // Insert the blog
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      // Get all URLs
      const urls = blogsAtEnd.map((blog) => blog.url)
      expect(urls).toContain('https://www.speedcurve.com/blog/web-performance-test-pull-requests/')
    },
    testTimeoutMS
  )

  test(
    'succeeds with valid data without "likes"',
    async () => {
      // Get the first user
      const firstUser = _.first(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Create a new blog object
      const newBlog = {
        title: '2023 recap: This year was all about making performance easy (well, easier)',
        author: 'Tammy Everts',
        url: 'https://www.speedcurve.com/blog/2023-easy-web-performance/'
      }

      // Insert the blog
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      // Get the latest blog
      const latestBlog = _(blogsAtEnd).last()
      expect(latestBlog.likes).toEqual(0)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 400 if "title" and "url" are not provided',
    async () => {
      // Get the first user
      const firstUser = _.first(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Create a new blog object
      const newBlog = {
        author: 'Tammy Everts'
      }

      // Insert the blog
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 401 if token is not provided',
    async () => {
      // Create a new blog object
      const newBlog = {
        title: 'How to automatically performance test your pull requests and fight regressions',
        author: 'Joseph Wynn',
        url: 'https://www.speedcurve.com/blog/web-performance-test-pull-requests/',
        likes: 1
      }

      // Insert the blog
      await api.post('/api/blogs').send(newBlog).expect(401)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },
    testTimeoutMS
  )
})

describe('deletion of a blog', () => {
  test(
    'succeeds with status code 204 if "id" and user are valid',
    async () => {
      // Get the first user
      const firstUser = _.first(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Get all blogs
      const blogsAtStart = await helper.blogsInDb()

      // Get the first blog to be deleted
      const blogToDelete = _.first(blogsAtStart)

      // Delete the blog
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      // Get all URLs
      const urls = blogsAtEnd.map((blog) => blog.url)
      expect(urls).not.toContain(blogToDelete.url)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 401 if "id" is valid but user is invalid',
    async () => {
      // Get the last user
      const lastUser = _.last(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(lastUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Get all blogs
      const blogsAtStart = await helper.blogsInDb()

      // Get the first blog to be deleted
      const blogToDelete = _.first(blogsAtStart)

      // Delete the blog
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(401)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      // Get all URLs
      const urls = blogsAtEnd.map((blog) => blog.url)
      expect(urls).toContain(blogToDelete.url)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 401 if token is not provided',
    async () => {
      // Get all blogs
      const blogsAtStart = await helper.blogsInDb()

      // Get the first blog to be deleted
      const blogToDelete = _.first(blogsAtStart)

      // Delete the blog
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 404 if "id" is invalid',
    async () => {
      const invalidId = '012345678901234567890123'

      // Get the first user
      const firstUser = _.first(helper.initialUsers)

      // Login the user and get the token
      const loginResponse = await api
        .post('/api/login')
        .send(firstUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = loginResponse.body.token

      // Delete the blog
      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(404)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },
    testTimeoutMS
  )
})

describe('modification of a blog', () => {
  test(
    'succeeds with status code 200 if "id" and data is valid',
    async () => {
      // Get all blogs
      const blogsAtStart = await helper.blogsInDb()

      // Get the first blog to be updated
      const blogToUpdate = _(blogsAtStart).first()
      blogToUpdate.likes = -1

      // Update the blog
      await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      // Get all likes
      const likes = blogsAtEnd.map((blog) => blog.likes)
      expect(likes).toContain(blogToUpdate.likes)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 404 if "id" is invalid',
    async () => {
      const invalidId = '012345678901234567890123'

      // Get all blogs
      const blogsAtStart = await helper.blogsInDb()

      // Get the first blog to be updated
      const blogToUpdate = _(blogsAtStart).first()
      blogToUpdate.likes = -1

      // Update the blog
      await api.put(`/api/blogs/${invalidId}`).send(blogToUpdate).expect(404)

      // Get all blogs
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      // Get all likes
      const likes = blogsAtEnd.map((blog) => blog.likes)
      expect(likes).not.toContain(blogToUpdate.likes)
    },
    testTimeoutMS
  )
})

afterAll(async () => {
  await mongoose.connection.close()
}, testTimeoutMS)
