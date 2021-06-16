import { useState } from "react";
import { Button, Form, Alert, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { registerUser } from './user.service'

export default function Register() {

  const [success, setSuccess] = useState(false)
  const [unknownError, setUnknownError] = useState(null)

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

  const onSubmit = async (data) => {
    setUnknownError(null)
    if(data.password !== data.password2) {
      setError('password2', { type: 'server', message: 'Hasła muszą byc takie same'});
      return;
    }
    try {
      await registerUser(data)
      setSuccess(true)
      setUnknownError(null)
      reset()
    } catch ({ response }) {
      if(response?.data && typeof response?.data === 'object') {
        setUnknownError(null)
        Object.keys(response.data).forEach(key => {
          setError(key, { type: 'server', message: response.data[key].join('\n') })
        })
      } else {
        setUnknownError('Wystąpił nieznany błąd')
      }
    }
  }

  let successAlert = success ?
    <Alert variant='success' className='my-4'>
      Na podany adres email został wysłany link aktywujący konto.
    </Alert>
    : null

  let errorAlert = unknownError ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null

  return (
    <Container>
      <h1>Zarejestruj się</h1>
      {successAlert}
      {errorAlert}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Imię</Form.Label>
          <Form.Control
            type='text'
            placeholder='Wpisz imię'
            isInvalid={errors?.firstName}
            {...register('firstName', { 
              required: { value: true, message: 'Imię jest wymagane'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.firstName?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Nazwisko</Form.Label>
          <Form.Control
            type='text'
            placeholder='Wpisz nazwisko'
            isInvalid={errors?.lastName}
            {...register('lastName', { 
              required: { value: true, message: 'Nazwisko jest wymagane'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.lastName?.message}
          </Form.Control.Feedback>
        </Form.Group>
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
        <Form.Group>
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type='password'
            isInvalid={errors?.password}
            {...register('password', { 
              required: { value: true, message: 'Hasło jest wymagane'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Powtórz hasło</Form.Label>
          <Form.Control
            type='password'
            isInvalid={errors?.password2}
            {...register('password2', { 
              required: { value: true, message: 'Hasło jest wymagane'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password2?.message}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Button 
          variant='primary'
          type='submit'>
          Zarejestruj się
        </Button>
        <Button 
          variant='secondary'
          onClick={() => { reset(); setSuccess(false); setUnknownError(null); }}
          className='ml-2'>
          Wyczyść
        </Button>
      </Form>
    </Container>
  )
}
