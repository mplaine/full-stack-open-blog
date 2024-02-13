import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'

const initialState = null

const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = loginSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedInBlogAppUserJSON = window.localStorage.getItem('loggedInBlogAppUser')
    if (loggedInBlogAppUserJSON) {
      const user = JSON.parse(loggedInBlogAppUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      if (user) {
        window.localStorage.setItem('loggedInBlogAppUser', JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch(setUser(user))
        dispatch(setNotification('success', `${user.name} logged in successfully`, 5))
      }
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export const logout = () => {
  return async (dispatch, getState) => {
    const user = getState().user
    window.localStorage.removeItem('loggedInBlogAppUser')
    dispatch(clearUser())
    dispatch(setNotification('success', `${user.name} logged out successfully`, 5))
  }
}

export default loginSlice.reducer
