const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')


const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: error.message
    })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'expired token'
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({
    error: 'unknown endpoint'
  })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  const token = authorization.replace('Bearer ', '')
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  request.user = await User.findById(decodedToken.id)

  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
}
