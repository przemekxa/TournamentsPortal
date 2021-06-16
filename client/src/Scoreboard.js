import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Match from './Match';
import { getMatches } from './tournament.service';

export default function Scoreboard({tournament, user}) {

  const [matches, setMatches] = useState([]);

  const update = async () => {
    try {
      let m = await getMatches(tournament)
      setMatches(m)
    } catch {
      setMatches([])
    }
  }

  useEffect(() => {
    async function getMatchesInner() {
      await update()
    }
    getMatchesInner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if(matches.length === 0) {
    return null;
  }

  let maxLevel = Math.max( ...matches.map(match => parseInt(match.level)))

  // Match with levels
  let matchLevels = new Array(maxLevel);
  for (var idx = 0; idx < matchLevels.length; idx++) {
    matchLevels[idx] = []
  }
  for(const match of matches) {
    matchLevels[match.level - 1].push(match)
  }

  // Result table
  let tab = new Array(2**(maxLevel - 1))
  for (var i = 0; i < tab.length; i++) {
    tab[i] = new Array(maxLevel);
    for(var j = 0; j < tab[i].length; j++) {
      tab[i][j] = <td
        key={`${i}:${j}`}
        style={{
          border: 'none',
          height: '250px',
          padding: '0'
        }}
        />
    }
  }
  for(const [i, levelMinus1] of matchLevels.entries()) {
    for(const [idx, match] of levelMinus1.entries()) {
      let col = maxLevel - match.level
      let row = idx * (maxLevel - match.level + 1)
      let rowSpan = 2**(maxLevel - match.level)
      let leftmost = match.level < maxLevel ? 
        <div style={{
          height: '50%',
          width: '20px',
          boxSizing: 'border-box',
          borderRight: '2px solid gray',
          borderTop: '2px solid gray',
          borderBottom: '2px solid gray',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          margin: '0 12px',
        }}>
        </div>
        : null;
      
      tab[row][col] = <td 
        key={`${i}:${idx}`}
        rowSpan={rowSpan}
        style={{
          //border: '1px solid black',
          border: 'none',
          height: '0px',
          padding: '0'
        }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minWidth: '200px',
          }}>
            {leftmost}
            <Match
              amatch={match}
              user={user}
              update={async () => await update()}
              />
          </div>
        </td>
      for(var rowSpanBegin = row + 1; rowSpanBegin < row + rowSpan; rowSpanBegin++) {
        tab[rowSpanBegin][col] = null;
      }
    }
  }

  let rows = tab.map((row, i) => {
    return <tr key={i}>{row}</tr>
  })

  return (
    <>
      <h3 className='mt-4 mb-4'>Tablica wyników</h3>
      <Table responsive>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </>
  )
}