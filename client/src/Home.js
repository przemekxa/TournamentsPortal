import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Container, Spinner } from 'react-bootstrap'
import HomeList from './HomeList'
import { Link } from "react-router-dom"
import { getTournaments } from './tournament.service'

export default function Home({user}) {

  const [data, setData] = useState({
    loading: true,
    current: 1,
    last: 1,
    data: []
  })

  const getData = async (page = 1, name = '') => {
    setData({loading: true})
    let data = await getTournaments(name, page, 10)
    setData({
      loading: false,
      current: data.current_page,
      last: data.last_page,
      data: data.data
    })
  }

  useEffect(() => {
    getData()
  }, [])

  let content = data.loading ?
    <Spinner
      animation='border'
      style={{display: 'block', margin: '64px auto'}} />
    :
    <HomeList 
      current={data.current}
      last={data.last}
      data={data.data}
      getData={(i) => getData(i)}
      />

  let addTournament = user ?
    <Link to='/addTournament'>
      <Button block>
        Dodaj turniej
      </Button>
    </Link>
    : null;

  return (
    <Container>
      <h1>Turnieje</h1>
      <div className='border rounded p-4 mt-4'>
        <h5>Wyszukaj po nazwie</h5>
        <Form>
          <Row>
            <Col>
              <Form.Control
                type='text'
                placeholder='Wpisz nazwę...'
                onChange={async (e) => await getData(data.current, e.target.value)}
              />
            </Col>
            <Col md='auto' className='mt-4 mt-md-0'>
              {/* <Button
                variant='secondary'
                className='ml-4 mr-0'
                onClick={async () => await getData(data.current)} >
                Wyczyść
              </Button> */}
            </Col>
          </Row>
        </Form>
      </div>
      {content}

      {addTournament}

    </Container>
  )
}
