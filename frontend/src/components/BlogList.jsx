import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import utils from '../utils'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const blogsToShow = [...blogs].sort(utils.compareByLikes)

  return (
    <ListGroup variant="flush" className="pt-2">
      {blogsToShow.map((blog) => (
        <ListGroup.Item key={blog.id} action className="px-0">
          <Link to={`/blogs/${blog.id}`}>
            &quot;{blog.title}&quot; by {blog.author}
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default BlogList
