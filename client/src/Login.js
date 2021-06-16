import { useState } from "react";
import { Button, Form, Alert, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import LoginRestore from "./LoginRestore";
import { login } from './user.service'

export default function Login({setUser}) {

  const [unknownError, setUnknownError] = useState(null)

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

  const history = useHistory();

  const onSubmit = async (data) => {
    try {
      let user = await login(data)
      setUser(user)
      history.push('/')
    } catch ({ response }) {
      if(response?.data && typeof response?.data === 'object') {
        setUnknownError(null)
        Object.keys(response.data).forEach(key => {
          setError(key, { type: 'server', message: response.data[key].join('\n') })
        })
      } else if(response?.status === 401) {
        setUnknownError('Nie znaleziono konta, nieprawidłowy email, hasło lub konto nie aktywowane')
      } else {
        setUnknownError('Wystąpił nieznany błąd')
      }
    }
  }

  let errorAlert = unknownError ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null

  return (
    <Container>
      <h1>Zaloguj się</h1>
      {errorAlert}
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
        
        <Button 
          variant='primary'
          type='submit'>
          Zaloguj się
        </Button>
        <Button 
          variant='secondary'
          onClick={() => { reset(); setUnknownError(null); }}
          className='ml-2'>
          Wyczyść
        </Button>
      </Form>
      <LoginRestore />
    </Container>
  )
}
