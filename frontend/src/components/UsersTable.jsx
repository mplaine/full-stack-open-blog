import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import utils from '../utils'

const UsersTable = () => {
  const users = useSelector((state) => state.users)
  const usersToShow = [...users].sort(utils.compareByBlogs)

  return (
    <Table hover>
      <thead>
        <tr>
          <th>Author</th>
          <th>Blogs created</th>
        </tr>
      </thead>
      <tbody>
        {usersToShow.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UsersTable
