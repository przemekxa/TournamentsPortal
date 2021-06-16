import { Pagination, ListGroup } from 'react-bootstrap'
import HomeListItem from './HomeListItem'

export default function HomeList({current, last, data, getData}) {

  let pages = Array(last).fill(0).map((_, i) => 
    <Pagination.Item
        key={i + 1}
        active={i + 1 === current}
        onClick={getData.bind(this, i + 1)}
      >
        {i + 1}
      </Pagination.Item>
  )

  let items = data?.map(item => <HomeListItem key={item.id} data={item} />)

  return (
    <div>
      <ListGroup className='my-4'>
        {items}
      </ListGroup>
      
      <Pagination className='d-flex justify-content-center'>
        {pages}
      </Pagination>
    </div>
  )
}
