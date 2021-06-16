import { useState } from "react";
import { Form, Button, Row, Col, Alert, Table } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { addRegistration } from "./registration.service";


export default function TournamentRegistrationList({registrations, canAdd, tournament, reload}) {

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  let rows = registrations.map((reg, idx) => 
    <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{reg.user.firstName}</td>
      <td>{reg.user.lastName}</td>
      <td>{reg.user.email}</td>
      <td>{reg.license}</td>
      <td>{reg.rank}</td>
    </tr>
  )

  const [unknownError, setUnknownError] = useState(null)

  const onSubmit = async (data) => {
    data.tournament = tournament;
    setUnknownError(null);
    try {
      await addRegistration(data)
      await reload();
    } catch ({ response }) {
      if(response?.data && typeof response?.data === 'object') {
        setUnknownError(null)
        Object.keys(response.data).forEach(key => {
          setError(key, { type: 'server', message: response.data[key].join('\n') })
        })
      } else if(response?.data) {
        setUnknownError(response?.data)
      } else {
        setUnknownError('Wystąpił nieznany błąd')
      }
    }
  }
  
  let errorAlert = unknownError ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null;

  let form = canAdd ?
    (<div>
      <h4>Zarejestruj się</h4>
      {errorAlert}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Licencja</Form.Label>
              <Form.Control
                type='text'
                placeholder='Wpisz licencję'
                isInvalid={errors?.license}
                {...register('license', { 
                  required: { value: true, message: 'Licencja jest wymagana'} 
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.license?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Ranking</Form.Label>
              <Form.Control
                type='text'
                placeholder='Wpisz ranking'
                isInvalid={errors?.rank}
                {...register('rank', { 
                  required: { value: true, message: 'Ranking jest wymagany'} 
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.rank?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button 
          variant='primary'
          block
          type='submit'>
          Zarejestruj się
        </Button>
      </Form>
    </div>) : null;

  return (
    <div>
      <h3 className='mt-4'>Rejestracje</h3>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Email</th>
            <th>Licencja</th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
      {form}
      
      
    </div>
  )
  
}