import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { login } from '../reducers/loginReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const resetForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    dispatch(login(username, password))
    resetForm()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername" className="pb-3">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formPassword" className="pb-3">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>
      <Button id="login-button" size="sm" type="submit">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm
