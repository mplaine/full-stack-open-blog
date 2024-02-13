import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification(state) {
      return null
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (type, message, duration) => {
  return async (dispatch) => {
    dispatch(showNotification({ type: type, message: message }))
    setTimeout(() => {
      dispatch(hideNotification())
    }, duration * 1000)
  }
}

export default notificationSlice.reducer
