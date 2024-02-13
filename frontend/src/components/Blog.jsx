import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteBlog, updateBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Button from 'react-bootstrap/Button'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blogId = useParams().id
  const blogs = useSelector((state) => state.blogs)
  const blog = blogs.find((blog) => blog.id === blogId)
  const user = useSelector((state) => state.user)

  const handleLike = (event) => {
    const updatedBlogObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    dispatch(updateBlog(updatedBlogObject, user))
    dispatch(setNotification('success', `An existing blog "${updatedBlogObject.title}" was successfully updated`, 5))
  }

  const handleDelete = (event) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification('success', `An existing blog "${blog.title}" was successfully removed`, 5))
      navigate('/blogs')
    }
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2 className="pb-3">{`"${blog.title}" by ${blog.author}`}</h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <Button size="sm" className="ms-1" onClick={handleLike}>
          Like
        </Button>
      </div>
      <div>
        added by {blog.user.name}
        {user.username === blog.user.username && (
          <Button size="sm" className="ms-1" onClick={handleDelete}>
            Remove
          </Button>
        )}
      </div>
      <h3 className="pb-3 fs-5">Comments</h3>
      <CommentForm />
      <CommentList />
    </div>
  )
}

export default Blog
