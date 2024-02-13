import { createSlice } from '@reduxjs/toolkit'
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
    const retrievedUsers = await userService.getUsers()
    dispatch(setUsers(retrievedUsers))
  }
}

export default userSlice.reducer
