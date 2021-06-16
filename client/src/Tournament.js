import { useState, useEffect } from "react";
import { Container, Spinner, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { useHistory, useParams, Link } from "react-router-dom";
import { url, getTournament, deleteTournament } from "./tournament.service";
import TournamentRegistrationList from "./TournamentRegistrationList";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Scoreboard from "./Scoreboard";

const icon = L.icon({ iconUrl: "/marker-icon.png" });

export default function Tournament({user}) {

  let { id } = useParams();
  let history = useHistory();
  const [tournament, setTournament] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const display = async () => {
    setTournament(null);
    try {
      let data = await getTournament(id);
      setTournament(data);
    } catch(error) {
      history.push('/notFound');
    }
  }

  const delTournament = async () => {
    try {
      await deleteTournament(id);
      history.push('/');
    } catch {
      console.error('Cannot delete tournament');
    }
  }


  const canRegister = () => {
    return (
      user != null &&
      tournament.registrations.length < tournament.maxParticipants &&
      (new Date(tournament.deadline)) > (new Date()) &&
      !tournament.registrations.some(r => r.user.email === user.email)
    )
  }

  useEffect(() => {
    async function displayInner() {
      await display()
    }
    displayInner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if(tournament) {
    let organizer = tournament.organizer;
    let date = new Date(tournament.date);
    let deadline = new Date(tournament.deadline);
    let deadlineBadge = deadline > (new Date()) ?
      <span className="badge badge-success">Przed terminem</span> :
      <span className="badge badge-secondary">Termin minął</span>

    let logoCols = tournament.logos?.map((logo, idx) =>
      <Col xs='4' key={idx} className='justify-content-center'>
        <Image
          src={url + 'logo/' + logo.filename}
          style={{maxHeight: '100px', display: 'block', margin: '12px auto'}}
          />
      </Col>
    )

    let logos = logoCols && logoCols?.length > 0 ?
      <div className='mt-4'>
        <h3>Sponsorzy</h3>
        <Row className='align-items-center justify-content-center'>
          {logoCols}
        </Row>
      </div>
      : null;

    let editButton = user?.email === organizer.email ? 
      <Row className='mt-5'>
        <Col>
          <Link to={`/tournament/${tournament.id}/edit`}>
            <Button block>Edytuj turniej</Button>
          </Link>
        </Col>
        <Col>
          <Button block variant='danger' onClick={() => setDeleteModal(true)}>Usuń turniej</Button>
        </Col>
      </Row>
      
      : null;

    return (
      <Container>
        <h1 className='mb-3'>{tournament.name}</h1>
        <p><strong>Dysciplina:</strong> {tournament.discipline}</p>
        <p><strong>Organizator:</strong> {organizer.firstName} {organizer.lastName} (<em>{organizer.email}</em>) </p>
        <p><strong>Data:</strong> {date.toLocaleString()}</p>
        <p><strong>Limit zgłoszeń:</strong> {tournament.maxParticipants}</p>
        <p><strong>Deadline na zgłoszenie:</strong> {deadline.toLocaleString()} {deadlineBadge}</p>

        <MapContainer
          center={[tournament.latitude, tournament.longitude]}
          zoom={13}
          scrollWheelZoom={false}
          style={{height: '300px'}}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[tournament.latitude, tournament.longitude]}
            icon={icon}
            />
        </MapContainer>

        <TournamentRegistrationList
          registrations={tournament.registrations}
          tournament={id}
          canAdd={canRegister()}
          reload={async () => await display() }
          />

        
        {logos}

        <Scoreboard
          user={user}
          tournament={tournament.id}
          />
        
        {editButton}

        <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Usuń turniej</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Czy na pewno chcesz usunąć turniej?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal(false)}
            >
              Zamknij
            </Button>
            <Button
              variant='danger'
              onClick={async () => await delTournament()}
            >
              Usuń
            </Button>
          </Modal.Footer>
      </Modal>
        
        
      </Container>
    )
  }

  return (
    <Spinner
      animation='border'
      style={{display: 'block', margin: '64px auto'}} />
  )
  
}