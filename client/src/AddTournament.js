import { useState, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { addLogo, addTournament } from "./tournament.service";

const icon = L.icon({ iconUrl: "/marker-icon.png" });
const poznan = {
  lat: 52.408333,
  lng: 16.934167
}

export default function AddTournament({user}) {

  const [unknownError, setUnknownError] = useState(null);
  const { register, handleSubmit, formState: { errors }, setError, reset, control } = useForm();

  const history = useHistory();

  const markerRef = useRef(null);

  const onSubmit = async (data) => {
    setUnknownError(null);

    var today = new Date();

    // Check the dates
    if(data.date < today) {
      setUnknownError('Wydarzenie nie może być w przeszłości');
      return;
    }
    if(data.deadline > data.date) {
      setUnknownError('Deadline nie może być późniejszy niż wydarzenie');
      return;
    }

    // Add tournament
    const marker = markerRef.current
    if (marker != null) {
      let latLng = marker.getLatLng()
      data.latitude = latLng.lat
      data.longitude = latLng.lng
    } else {
      setUnknownError('Wystąpił błąd związany z mapami')
      return
    }

    try {
      let tournament = await addTournament(data)
      for(const logo of data.logos) {
        await addLogo(tournament.id, logo);
      }
      history.push(`/tournament/${tournament.id}`)
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
    : null

  return (
    <Container>
      <h1>Dodaj turniej</h1>
      {errorAlert}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>

        <Form.Group>
          <Form.Label>Nazwa</Form.Label>
          <Form.Control
            type='text'
            placeholder='Wpisz nazwę turnieju'
            isInvalid={errors?.name}
            {...register('name', { 
              required: { value: true, message: 'Nazwa jest wymagana'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Dyscyplina</Form.Label>
          <Form.Control
            type='text'
            placeholder='Wpisz nazwę turnieju'
            isInvalid={errors?.discipline}
            {...register('discipline', { 
              required: { value: true, message: 'Dyscyplina jest wymagana'} 
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.discipline?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Maksymalna liczba uczestników</Form.Label>
          <Form.Control
            type='number'
            placeholder='Wpisz liczbę uczestników'
            isInvalid={errors?.maxParticipants}
            {...register('maxParticipants', { 
              required: { value: true, message: 'Maksymalna liczba uczestników jest wymagana'},
              min: { value: 1, message: 'Musi być co najmniej jeden uczestnik'},
              max: { value: 255, message: 'Maksymalna liczba uczestników wynosi 255'}
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.maxParticipants?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className='mr-3'>Data </Form.Label>
          <Controller
            control={control}
            name='date'
            rules={{ 
              required: { value: true, message: 'Data jest wymagana'},
            }}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                value={value}
                onChange={onChange}
              />
            )}
          />
          <span className='ml-3'>{errors?.date?.message}</span>
        </Form.Group>

        <Form.Group>
          <Form.Label className='mr-3'>Deadline na zgłoszenia </Form.Label>
          <Controller
            control={control}
            name='deadline'
            rules={{ 
              required: { value: true, message: 'Data jest wymagana'},
            }}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                value={value}
                onChange={onChange}
              />
            )}
          />
          <span className='ml-3'>{errors?.deadline?.message}</span>
        </Form.Group>

        <h5>Lokalizacja</h5>

        <MapContainer
          center={poznan}
          zoom={13}
          scrollWheelZoom={false}
          style={{height: '300px', margin: '0 0 32px 0', zIndex: 0}}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={poznan}
            icon={icon}
            draggable={true}
            ref={markerRef}
            />
        </MapContainer>

        <h5>Loga sponsorów</h5>
        <Form.File
          id='logos'
          label='Wybierz loga'
          multiple
          accept='image/png, image/jpeg'
          className='mb-4'
          {...register('logos')}
        />

        
        <Button 
          variant='primary'
          type='submit'>
          Dodaj
        </Button>
        <Button 
          variant='secondary'
          onClick={() => { reset(); setUnknownError(null); }}
          className='ml-2'>
          Wyczyść
        </Button>
      </Form>

    </Container>
  )
}