import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import UserBlogList from './UserBlogList'

const User = () => {
  const id = useParams().id
  const users = useSelector((state) => state.users)
  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2 className="pb-3">{user.name}</h2>
      <h3 className="fs-5">Added blogs</h3>
      <UserBlogList />
    </div>
  )
}

export default User
