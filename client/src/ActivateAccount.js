import { useState, useEffect } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { activateAccount } from "./user.service";

export default function ActivateAccount() {

  const [success, setSuccess] = useState(null);
  const { link } = useParams();

  useEffect(() => {
    async function activateInner() {
      try {
        let decoded = JSON.parse(atob(link));
        await activateAccount(decoded);
        setSuccess(true);
      } catch {
        setSuccess(false);
      }
    }
    activateInner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let successAlert = success === true ?
    <Alert variant='success' className='my-4'>Udało się aktywować konto.</Alert>
    : null;

  let errorAlert = success === false ?
    <Alert variant='danger' className='my-4'>Błąd podczas aktywacji konta.</Alert>
    : null;

  let spinner = success === null ?
    <Spinner animation='border' style={{display: 'block', margin: '64px auto'}} />
    : null;


  return (
    <Container>
      <h1>Aktywacja konta</h1>
      {successAlert}
      {errorAlert}
      {spinner}
    </Container>
  )
}