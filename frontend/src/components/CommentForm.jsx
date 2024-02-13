import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

import { addBlogComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const CommentForm = () => {
  const dispatch = useDispatch()
  const id = useParams().id
  const [comment, setComment] = useState('')

  const resetForm = () => {
    setComment('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newCommentObject = {
      comment
    }

    dispatch(addBlogComment(id, newCommentObject))
    dispatch(setNotification('success', `A new blog comment "${newCommentObject.comment}" was successfully created`, 5))
    resetForm()
  }

  return (
    <Container className="border border-secondary-subtle bg-light p-4 rounded">
      <h3 className="pb-3 fs-5">Create new</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle" className="pb-3">
          <Form.Label>Comment:</Form.Label>
          <Form.Control
            type="text"
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </Form.Group>
        <Button id="add-comment-button" size="sm" type="submit">
          Add
        </Button>
      </Form>
    </Container>
  )
}

export default CommentForm
