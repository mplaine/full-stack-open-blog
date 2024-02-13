import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

const UserBlogList = () => {
  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const userBlogs = blogs.filter((blog) => blog.user.id === id)

  return (
    <ListGroup variant="flush" className="pt-2">
      {userBlogs.map((blog) => (
        <ListGroup.Item key={blog.id} action className="px-0">
          {blog.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default UserBlogList
