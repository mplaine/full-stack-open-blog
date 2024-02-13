import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    replaceBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
    },
    addComment(state, action) {
      const { id, comment } = action.payload
      return state.map((blog) => (blog.id === id ? { ...blog, comments: blog.comments.concat(comment) } : blog))
    }
  }
})

export const { setBlogs, appendBlog, removeBlog, replaceBlog, addComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const retrievedBlogs = await blogService.getBlogs()
      dispatch(setBlogs(retrievedBlogs))
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export const createBlog = (blogToBeCreated, user) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.createBlog(blogToBeCreated)
      if (createdBlog) {
        const userId = createdBlog.user
        createdBlog.user = {
          username: user.username,
          name: user.name,
          id: userId
        }
        dispatch(appendBlog(createdBlog))
      }
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(id)
      dispatch(removeBlog(id))
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export const updateBlog = (blogToBeUpdated, user) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.updateBlog(blogToBeUpdated.id, blogToBeUpdated)
      if (updatedBlog) {
        const userId = updatedBlog.user
        updatedBlog.user = {
          username: user.username,
          name: user.name,
          id: userId
        }
        dispatch(replaceBlog(updatedBlog))
      }
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export const addBlogComment = (id, commentToBeAdded) => {
  return async (dispatch) => {
    try {
      const createdBlogComment = await blogService.addBlogComment(id, commentToBeAdded)
      if (createdBlogComment) {
        dispatch(addComment({ id, comment: createdBlogComment }))
      }
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export default blogSlice.reducer
