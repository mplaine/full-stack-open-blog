import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { logout } from '../reducers/loginReducer'

const LoginStatus = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const userId = users.find((u) => u.username === user.username)?.id || null

  const handleLogout = (event) => {
    dispatch(logout())
  }

  if (user === null) {
    return null
  }

  return (
    <Navbar.Text className="py-0">
      Signed in as:
      <Button variant="link" href={`/users/${userId}`} className="ps-1">
        {user.name}
      </Button>
      <Button variant="light" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </Navbar.Text>
  )
}

export default LoginStatus
