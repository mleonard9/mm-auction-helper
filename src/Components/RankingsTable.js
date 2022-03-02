import React, { useState, useEffect } from 'react';
import KenPomData from '../Data/kenpom.json'
import Seeds from '../Data/seeding.json'
import MaterialTable from 'material-table';

function RankingsTable() {  
  const [data, setData] = useState(KenPomData)

  const columns = [
    { title: 'Team', field: 'TeamName' },
    { title: 'Seed', field: 'Seed', type: 'numeric' },
    // { title: 'NET', field: 'NET', type: 'numeric' },
    { title: 'RankAdjEM', field: 'RankAdjEM', type: 'numeric' },
    { title: 'Rank OE', field: 'RankOE', type: 'numeric' },
    { title: 'Rank DE', field: 'RankDE', type: 'numeric' },
    { title: 'Value', field: 'Value', type: 'numeric' },
  ]

  function getSeed(TeamName) {
    const seeding = Seeds.find(el => el.team === TeamName);
    if(seeding) {
      return seeding.seed
    }

    return 17
  }

  useEffect(() => {
    let processedData = KenPomData.map((team) => {
      return {
        ...team,
        Seed: getSeed(team.TeamName),
        Value: (getSeed(team.TeamName) * 4) - team.RankAdjEM
      }
    }).filter(team => team.Seed < 17)

    setData(processedData)
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={data}        
      options={{
        sorting: true,
        search: false,
        paging: false,
        toolbar: false
      }}
    />
  );
}

export default RankingsTable

// "TeamName": "Abilene Christian",
// "Tempo": 71.4859,
// "RankTempo": 41,
// "AdjTempo": 70.9175,
// "RankAdjTempo": 36,
// "OE": 101.233,
// "RankOE": 193,
// "AdjOE": 102.588,
// "RankAdjOE": 198,
// "DE": 95.299,
// "RankDE": 40,
// "AdjDE": 100.248,
// "RankAdjDE": 108,
// "AdjEM": 2.34036,
// "RankAdjEM": 140
