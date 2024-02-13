import { useState } from 'react'
import { useDispatch } from 'react-redux'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = ({ blogFormRef, user }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newBlogObject = {
      title,
      author,
      url
    }

    dispatch(createBlog(newBlogObject, user))
    dispatch(setNotification('success', `A new blog "${newBlogObject.title}" was successfully created`, 5))
    blogFormRef.current.toggleVisibility()
    resetForm()
  }

  return (
    <Container className="border border-secondary-subtle bg-light p-4 rounded">
      <h3 className="pb-3 fs-5">Create new</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle" className="pb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" name="title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="formAuthor" className="pb-3">
          <Form.Label>Author:</Form.Label>
          <Form.Control type="text" name="author" value={author} onChange={(event) => setAuthor(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="formUrl" className="pb-3">
          <Form.Label>URL:</Form.Label>
          <Form.Control type="text" name="url" value={url} onChange={(event) => setUrl(event.target.value)} />
        </Form.Group>
        <Button id="create-blog-button" size="sm" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  )
}

export default BlogForm
