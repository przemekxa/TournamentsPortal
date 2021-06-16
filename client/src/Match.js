import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap"
import { addWinner } from "./tournament.service"

export default function Match({amatch, user, update}) {

  const [modal, setModal] = useState(false);

  const setWinner = async (winner) => {
    setModal(false)
    await addWinner(amatch.tournament, amatch.id, winner)
    update()
  }

  let winnerA = amatch.winnerA === 'A' && amatch.winnerB === 'A' ? 
    <strong>WYGRANA</strong>
    : null;

  let winnerB = amatch.winnerA === 'B' && amatch.winnerB === 'B' ? 
    <strong>WYGRANA</strong>
    : null;

  let registerButton =
    (user?.email && amatch.player_a && amatch.player_b) &&
    (
      (amatch.winnerA === null && user?.email === amatch.player_a?.email) ||
      (amatch.winnerB === null && user?.email === amatch.player_b?.email) 
    ) ?
    <Button
      variant='primary'
      className='mt-3'
      onClick={() => setModal(true)}
      block
    >Zarejestruj wynik</Button>
    : null;

  return (
    <>
    <Card style={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: '300px',
      width: '100%',
    }}>
      <Card.Body>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '0px solid black'}}>
          <div>
            <p className='mt-0 mb-0'>{amatch.player_a?.firstName ?? '-'} {amatch.player_a?.lastName}</p>
            <small className='mt-0 mb-0'>{amatch.player_a?.email}</small>
          </div>
          <div className='ml-3'>
            {winnerA}
          </div>
        </div>
        <hr />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '0px solid black'}}>
        <div>
            <p className='mt-0 mb-0'>{amatch.player_b?.firstName ?? '-'} {amatch.player_b?.lastName}</p>
            <small className='mt-0 mb-0'>{amatch.player_b?.email}</small>
          </div>
          <div className='ml-3'>
            {winnerB}
          </div>
        </div>
        {registerButton}
      </Card.Body>
    </Card>
    <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Zarejestruj wynik</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Wybierz, kto wygrał ten mecz:
          <h3>A</h3>
          <p className='mt-0 mb-0'>{amatch.player_a?.firstName} {amatch.player_a?.lastName}</p>
          <small className='mt-0 mb-0'>{amatch.player_a?.email}</small>
          <h3>B</h3>
          <p className='mt-0 mb-0'>{amatch.player_b?.firstName} {amatch.player_b?.lastName}</p>
          <small className='mt-0 mb-0'>{amatch.player_b?.email}</small>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModal(false)}
          >
            Zamknij
          </Button>
          <Button
            variant="primary"
            onClick={async () => await setWinner('A')}
          >
            A ({amatch.player_a?.email})
          </Button>
          <Button
            variant="primary"
            onClick={async () => await setWinner('B')}
          >
            B ({amatch.player_b?.email})
          </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}