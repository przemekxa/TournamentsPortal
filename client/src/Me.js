import React, { useState, useEffect } from 'react'
import { Container, Table } from "react-bootstrap";
import { useHistory, Link } from 'react-router-dom';
import { me } from './user.service';

export default function Me({user}) {

  const history = useHistory();
  const [details, setDetails] = useState(null);
  const [filterMatches, setFilterMatches] = useState(false);

  const display = async () => {
    if(user?.email) {
      try {
        let data = await me()
        setDetails(data)
      } catch {
        history.push('/');
      }
    } else {
      history.push('/login');
    }
  }

  useEffect(() => {
    async function displayInner() {
      await display()
    }
    displayInner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if(user === null) {
    return <p>Brak dostępu</p>
  }

  let organizer = details?.organizer.map((t, idx) =>
    <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{t.name}</td>
      <td>{t.discipline}</td>
      <td>{(new Date(t.date)).toLocaleString()}</td>
      <td><Link to={`/tournament/${t.id}`}>Zobacz</Link></td>
    </tr>
  )

  let registrations = details?.registrations.map((r, idx) =>
    <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{r.tournament.name}</td>
      <td>{(new Date(r.tournament.date)).toLocaleString()}</td>
      <td>{r.license}</td>
      <td>{r.rank}</td>
      <td><Link to={`/tournament/${r.tournament.id}`}>Zobacz</Link></td>
    </tr>
  )

  let matches = details?.matches
    .filter((match) => {
      if(filterMatches) {
        return match.winnerA === null || match.winnerB === null;
      }
      return true;
    })
    .map((m, idx) => {
      let opponent = m.player_a.email === user.email ? m.player_b : m.player_a;
      let result = '-';
      if(m.winnerA === m.winnerB && (m.winnerA === 'A' || m.winnerA === 'B')) {
        if(
          (m.winnerA === 'A' && m.player_a.email === user.email) ||
          (m.winnerA === 'B' && m.player_b.email === user.email)) {
            result = 'Wygrana';
        } else {
          result = 'Przegrana';
        }
      }
      return (<tr key={idx}>
        <td>{idx + 1}</td>
        <td>{m.tournament.name}</td>
        <td>{(new Date(m.tournament.date)).toLocaleString()}</td>
        <td>{opponent.firstName} {opponent.lastName} ({opponent.email})</td>
        <td>{result}</td>
        <td><Link to={`/tournament/${m.tournament.id}`}>Zobacz</Link></td>
      </tr>)
  })

  return (
    <Container>
      <h1>Twój profil</h1>
      <p><strong>Imię:</strong> {user.firstName}</p>
      <p><strong>Nazwisko:</strong> {user.lastName}</p>
      <p><strong>Adres email:</strong> {user.email}</p>

      <h2 className='mt-5'>Twoje turnieje</h2>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nazwa</th>
            <th>Dyscyplina</th>
            <th>Data</th>
            <th>Zobacz</th>
          </tr>
        </thead>
        <tbody>
          {organizer}
        </tbody>
      </Table>

      <h2 className='mt-5'>Twoje rejestracje</h2>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Turniej</th>
            <th>Data</th>
            <th>Licencja</th>
            <th>Ranking</th>
            <th>Zobacz</th>
          </tr>
        </thead>
        <tbody>
          {registrations}
        </tbody>
      </Table>

      <h2 className='mt-5'>Twoje mecze</h2>
      <p>
        <input
          type='checkbox'
          checked={filterMatches}
          onChange={(e) => setFilterMatches(e.target.checked)}
        /> Tylko mecze bez wyniku {filterMatches}
      </p>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Turniej</th>
            <th>Data</th>
            <th>Przeciwnik</th>
            <th>Rezultat</th>
            <th>Zobacz</th>
          </tr>
        </thead>
        <tbody>
          {matches}
        </tbody>
      </Table>
      {/* TODO: Dodać mecze */}


    </Container>
  )
}