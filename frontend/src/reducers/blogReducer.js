import { createSlice } from '@reduxjs/toolkit'
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
    const retrievedBlogs = await blogService.getBlogs()
    dispatch(setBlogs(retrievedBlogs))
  }
}

export const createBlog = (blogToBeCreated, user) => {
  return async (dispatch) => {
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
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const updateBlog = (blogToBeUpdated, user) => {
  return async (dispatch) => {
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
  }
}

export const addBlogComment = (id, commentToBeAdded) => {
  return async (dispatch) => {
    const createdBlogComment = await blogService.addBlogComment(id, commentToBeAdded)
    if (createdBlogComment) {
      dispatch(addComment({ id, comment: createdBlogComment }))
    }
  }
}

export default blogSlice.reducer
