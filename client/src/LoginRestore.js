import { useState } from "react";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { loginRestore } from './user.service'

export default function LoginRestore() {

  const [success, setSuccess] = useState(null)
  const [unknownError, setUnknownError] = useState(null)

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();


  const onSubmit = async (data) => {
    setSuccess(null)
    setUnknownError(null)
    try {
      await loginRestore(data.email);
      setSuccess(true);
      reset();
    } catch ({ response }) {
      if(response?.data && typeof response?.data === 'object') {
        setUnknownError(null)
        Object.keys(response.data).forEach(key => {
          setError(key, { type: 'server', message: response.data[key].join('\n') })
        })
      } else if(response?.status === 401) {
        setUnknownError('Brak autoryzacji')
      } else {
        setUnknownError('Wystąpił nieznany błąd')
      }
    }
  }

  let errorAlert = unknownError ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null

  let successAlert = success ?
    <Alert variant='success' className='my-4'>Wiadomość z linkiem resetującym hasło została wysłana na podany adres email.</Alert>
    : null

  return (
    
    <Card className='mt-5'>
        <Card.Header as='h3'>Przypomnij hasło</Card.Header>
      <Card.Body>
        <p>
          Jeśli nie pamiętasz hasła, możesz je przywrócić, klikając w link wysłany na maila.
        </p>
        {errorAlert}
        {successAlert}
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              placeholder='Wpisz email'
              isInvalid={errors?.email}
              {...register('email', { 
                required: { value: true, message: 'Email jest wymagany'} 
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Button 
            variant='primary'
            type='submit'>
            Przypomnij
          </Button>
          <Button 
            variant='secondary'
            onClick={() => { reset(); setUnknownError(null); setSuccess(null); }}
            className='ml-2'>
            Wyczyść
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
