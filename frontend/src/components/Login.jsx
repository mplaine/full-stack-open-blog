import LoginForm from './LoginForm'
import Notification from './Notification'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Login = () => {
  return (
    <Container>
      <Row className="align-items-center justify-content-center">
        <Col className="text-center" md={6}>
          <h2 className="pb-3">Log in to The Blog App</h2>
          <Notification />
          <LoginForm />
        </Col>
      </Row>
    </Container>
  )
}

export default Login
