const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000) // 30 seconds
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const testTimeoutMS = 20000 // 20 seconds
const User = require('../models/user')
const Blog = require('../models/blog')

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

describe('when there is initially some users saved', () => {
  test(
    'users are returned as json',
    async () => {
      // Get all users
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    },
    testTimeoutMS
  )

  test(
    'all users are returned',
    async () => {
      // Get all users
      const users = await helper.usersInDb()
      expect(users).toHaveLength(helper.initialUsers.length)
    },
    testTimeoutMS
  )

  test(
    'each user has "id"',
    async () => {
      // Get all users
      const users = await helper.usersInDb()

      // Iterate over users
      users.forEach((user) => {
        expect(user.id).toBeDefined()
        // expect(user).toHaveProperty('id')
      })
    },
    testTimeoutMS
  )
})

describe('addition of a new user', () => {
  test(
    'succeeds with valid data',
    async () => {
      // Create a new user object
      const newUser = {
        username: 'johndoe',
        name: 'John Doe',
        password: 'mypassword'
      }

      // Insert the user
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Get all users
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

      // Get all usernames
      const usernames = usersAtEnd.map((user) => user.username)
      expect(usernames).toContain('johndoe')
    },
    testTimeoutMS
  )

  test(
    'fails with status code 400 if "username" is already taken',
    async () => {
      // Create a new user object
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'mypassword'
      }

      // Insert the user
      const usersResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(usersResponse.body.error).toContain('expected `username` to be unique')

      // Get all users
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 400 if "username" is too short',
    async () => {
      // Create a new user object
      const newUser = {
        username: 'jw',
        name: 'Joseph Wynn',
        password: 'nnyw'
      }

      // Insert the user
      const usersResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(usersResponse.body.error).toContain('Username must be at least 3 characters long')

      // Get all users
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    testTimeoutMS
  )

  test(
    'fails with status code 400 if "password" is too short',
    async () => {
      // Create a new user object
      const newUser = {
        username: 'jwynn',
        name: 'Joseph Wynn',
        password: 'wj'
      }

      // Insert the user
      const usersResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(usersResponse.body.error).toContain('Password must be at least 3 characters long')

      // Get all users
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    },
    testTimeoutMS
  )
})

afterAll(async () => {
  await mongoose.connection.close()
}, testTimeoutMS)
