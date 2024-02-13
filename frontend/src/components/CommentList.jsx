import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import { v4 as uuidv4 } from 'uuid'

const CommentList = () => {
  const blogId = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === blogId)

  return (
    <ListGroup variant="flush" className="pt-2">
      {blog.comments.map((comment) => (
        <ListGroup.Item key={uuidv4()} action className="px-0">
          {comment}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default CommentList
