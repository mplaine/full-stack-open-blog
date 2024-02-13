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
}, testTimeoutMS)

describe('login an existing user', () => {
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

      expect(token).toBeDefined()
    },
    testTimeoutMS
  )

  test(
    'fails with status code 401 if "username" or "password" is invalid',
    async () => {
      // Create a new user object
      const user = {
        username: 'root',
        name: 'Superuser',
        password: 'wrongpassword'
      }

      // Login the user
      const loginResponse = await api
        .post('/api/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(loginResponse.body.error).toContain('Invalid username or password')
    },
    testTimeoutMS
  )
})

afterAll(async () => {
  await mongoose.connection.close()
}, testTimeoutMS)
