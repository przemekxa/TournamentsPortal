import { useState } from "react";
import { Container, Alert, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { resetPassword } from "./user.service";

export default function ResetPassword() {

  const [unknownError, setUnknownError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { email, restoration } = useParams();

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

  const onSubmit = async (data) => {
    setUnknownError(null)
    if(data.password !== data.password2) {
      setError('password2', { type: 'server', message: 'Hasła muszą byc takie same'});
      return;
    }
    try {
      await resetPassword(atob(email), data.password, restoration)
      setSuccess(true)
      setUnknownError(null)
      reset()
    } catch ({ response }) {
      if(response?.data && typeof response?.data === 'object') {
        setUnknownError(null)
        Object.keys(response.data).forEach(key => {
          setError(key, { type: 'server', message: response.data[key].join('\n') })
        })
        setUnknownError('Wystąpił błąd')
      } else if(response?.data) {
        setUnknownError(response?.data)
      } else {
        setUnknownError('Wystąpił nieznany błąd')
      }
    }
  }

  let successAlert = success === true ?
    <Alert variant='success' className='my-4'>Udało się zmienić hasło.</Alert>
    : null;

  let errorAlert = unknownError !== null ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null;


  return (
    <Container>
      <h1>Przywracanie hasła</h1>
      {successAlert}
      {errorAlert}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
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
          Ustaw hasło
        </Button>
      </Form>
    </Container>
  )
}