import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import userService from '../services/users'

const initialState = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = userSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const retrievedUsers = await userService.getUsers()
      dispatch(setUsers(retrievedUsers))
    } catch (exception) {
      dispatch(setNotification('danger', exception.response.data.error, 5))
    }
  }
}

export default userSlice.reducer
