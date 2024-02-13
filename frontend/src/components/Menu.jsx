import LoginStatus from './LoginStatus'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const Menu = () => {
  return (
    <Navbar expand="lg" fixed="top" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/blogs">Blogs</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          <LoginStatus />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menu
