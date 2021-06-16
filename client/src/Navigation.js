import { Button, Navbar, Nav } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { logout } from "./user.service"

export default function Navigation({user, setUser}) {

  const history = useHistory();

  const onLogout = async () => {
    await logout;
    setUser(null);
    history.push('/');
  }

  let toolbar = user ?
    <Nav>
      <Navbar.Text className='mx-2'>
        Zalogowano jako <Link to='/me'>{user.firstName} {user.lastName} ({user.email})</Link>
      </Navbar.Text>
      <Nav.Item className='mr-2'>
        <Link to='/me'>
          <Button variant='outline-secondary'>Profil</Button>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Button variant='outline-secondary' onClick={onLogout}>Wyloguj</Button>
      </Nav.Item>
    </Nav>
    :
    <Nav>
      <Navbar.Text className='mx-2'>
        <Link to='/login'>Zaloguj się</Link>
      </Navbar.Text>
      <Navbar.Text className='mx-2'>
        <Link to='/register'>Zarejestruj się</Link>
      </Navbar.Text>
    </Nav>

  return (
    <Navbar bg='light' className='mb-4'>
        <Navbar.Brand>
          <Link to='/'>Portal turniejowy</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {toolbar}
        </Navbar.Collapse>
      </Navbar>
  )
}
