const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const retrievedUsers = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(retrievedUsers)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!username || typeof username !== 'string' || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' })
  }
  if (!password || typeof password !== 'string' || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const createdUser = await user.save()
  response.status(201).json(createdUser)
})

module.exports = usersRouter
