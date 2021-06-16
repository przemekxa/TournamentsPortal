import { useState, useRef, useEffect, useMemo } from "react";
import { Container, Form, Button, Alert, Spinner, Table, Image } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useHistory, useParams, Link } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { url, getTournament, addLogo, editTournament, deleteLogo } from "./tournament.service";

const icon = L.icon({ iconUrl: "/marker-icon.png" });

export default function EditTournament({user}) {

  let { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [position, setPosition] = useState(null);
  const [unknownError, setUnknownError] = useState(null);
  const { register, handleSubmit, formState: { errors }, setError, control } = useForm();

  const history = useHistory();

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )

  // Display the current tournament

  const display = async () => {
    setTournament(null);
    try {
      let data = await getTournament(id);
      setPosition({lat: data.latitude, lng: data.longitude})
      setTournament(data);
    } catch(error) {
      history.push('/notFound');
    }
  }

  useEffect(() => {
    async function displayInner() {
      await display()
    }
    displayInner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if(tournament === null) {
    return <Spinner animation='border' style={{display: 'block', margin: '64px auto'}} />
  }

  // Update the tournament

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

    // Edit tournament
    data.latitude = position.lat
    data.longitude = position.lng

    let logosToDelete = [];
    for (const [key, value] of Object.entries(data)) {
      if(key.startsWith('logo_')) {
        if(value === true) {
          logosToDelete.push(key.replace('logo_', ''));
        }
        delete data[key]
      }
    }

    try {
      await editTournament(id, data);
      for(const logo of data.logos) {
        await addLogo(tournament.id, logo);
      }
      for(const logo of logosToDelete) {
        await deleteLogo(logo);
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

  let existingLogos = tournament.logos?.map((logo, idx) =>
  <tr key={idx}>
    <td>{idx + 1}</td>
    <td>?</td>
    <td>
      <Image
        src={url + 'logo/' + logo.filename}
        style={{maxHeight: '100px', display: 'block', margin: '12px auto'}}
        />
    </td>
    <td>
      <Form.Check
        id={'logo_' + logo.id}
        {...register('logo_' + logo.id)}
        />
    </td>
  </tr>
)

  let errorAlert = unknownError ?
    <Alert variant='danger' className='my-4'>{unknownError}</Alert>
    : null

  return (
    <Container>
      <h1>Edytuj turniej</h1>
      {errorAlert}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>

        <Form.Group>
          <Form.Label>Nazwa</Form.Label>
          <Form.Control
            type='text'
            placeholder='Wpisz nazwę turnieju'
            defaultValue={tournament.name}
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
            defaultValue={tournament.discipline}
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
            defaultValue={tournament.maxParticipants}
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
            defaultValue={new Date(tournament.date)}
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
            defaultValue={new Date(tournament.deadline)}
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
          center={{lat: tournament.latitude, lng: tournament.longitude}}
          zoom={13}
          scrollWheelZoom={false}
          style={{height: '300px', margin: '0 0 32px 0', zIndex: 0}}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            eventHandlers={eventHandlers}
            position={position}
            icon={icon}
            draggable={true}
            ref={markerRef}
            />
        </MapContainer>

        <h5>Loga sponsorów</h5>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Identyfikator</th>
              <th>Logo</th>
              <th>Usuń?</th>
            </tr>
          </thead>
          <tbody>
            {existingLogos}
          </tbody>
        </Table>
        <Form.File
          id='logos'
          label='Wybierz nowe, dodatkowe loga'
          multiple
          accept='image/png, image/jpeg'
          className='mb-4'
          {...register('logos')}
        />

        
        <Button 
          variant='primary'
          type='submit'>
          Zapisz
        </Button>
        <Link to={'/tournament/' + id}>
          <Button 
            variant='secondary'
            className='ml-2'>
            Wróć
          </Button>
        </Link>
        
      </Form>

    </Container>
  )
}