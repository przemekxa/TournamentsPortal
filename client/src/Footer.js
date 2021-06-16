import { Navbar, Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className='mt-5'>
      <Navbar bg='light'>
        <Container className='text-center'>
          <p className='my-4' style={{width: '100%'}}>
            Przemysław Ambroży, {(new Date()).getFullYear()}
          </p>
        </Container>
      </Navbar>
    </footer>
  )
}