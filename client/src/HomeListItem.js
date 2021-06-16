import { ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';

export default function HomeListItem({ data }) {

  const history = useHistory();

  return <ListGroup.Item
    action
    onClick={() => history.push(`/tournament/${data.id}`)}
  >
    <h5>{data.name}</h5>
    <p className='my-1'>
      <span className='text-secondary'>Dyscyplina: </span>
      {data.discipline}
    </p>
    <p className='my-1'>
      <span className='text-secondary'>Termin napływania zgłoszeń: </span>
      {(new Date(data.deadline)).toLocaleDateString()}
    </p>
    <p className='my-1 text-monospace text-secondary'>
      <small>#{data.id}</small>
    </p>
    {/* {JSON.stringify(data)} */}
  </ListGroup.Item>
}