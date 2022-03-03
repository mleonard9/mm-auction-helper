import React, { useState, useEffect } from 'react';
import KenPomData from '../Data/kenpom.json'
import Seeds from '../Data/seeding.json'
import MaterialTable from 'material-table';
import { TablePagination } from '@material-ui/core';
import styled from 'styled-components';

function PatchedPagination(props) {
  const {
    ActionsComponent,
    onChangePage,
    onChangeRowsPerPage,
    ...tablePaginationProps
  } = props;

  return (
    <TablePagination
      {...tablePaginationProps}
      // @ts-expect-error onChangePage was renamed to onPageChange
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={(subprops) => {
        const { onPageChange, ...actionsComponentProps } = subprops;
        return (
          // @ts-expect-error ActionsComponent is provided by material-table
          <ActionsComponent
            {...actionsComponentProps}
            onChangePage={onPageChange}
          />
        );
      }}
    />
  );
}

const RosterCard = styled.div`
  width: 16rem;
  margin: 2rem auto;
  padding: .5rem 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

function RankingsTable() {  
  const [data, setData] = useState(KenPomData)
  const [selectedTeams, setSelectedTeams] = useState([])
  const [totalCost, setTotalCost] = useState(0);

  const columns = [   
    { title: 'Team', field: 'TeamName' },
    { title: 'Seed', field: 'Seed', type: 'numeric', defaultSort: 'asc' },
    { title: 'Value', field: 'Value', type: 'numeric' },
    // { title: 'NET', field: 'NET', type: 'numeric' },
    { title: 'KP', field: 'RankAdjEM', type: 'numeric' },
    { title: 'Off', field: 'RankOE', type: 'numeric' },
    { title: 'Def', field: 'RankDE', type: 'numeric' },
    { title: '$', field: 'Cost', type: 'numeric'},
  ]
  
  function getSeed(TeamName) {
    const seeding = Seeds.find(el => el.team === TeamName);
    if(seeding) {
      return seeding.seed
    }

    return 17
  }

  function processSelections(selections) {
    setSelectedTeams(selections)
    var cost = 0
    selections.forEach((team) => {
      cost += team.Cost
    })
    setTotalCost(cost)
  }

  useEffect(() => {
    const cost = new Map([
      [1,1085],
      [2,689],
      [3,427],
      [4,359],
      [5,202],
      [6,198],
      [7,98],
      [8,68],
      [9,51],
      [10,46],
      [11,55],
      [12,50],
      [13,25],
      [14,10],
      [15,13],
      [16,1]
    ])

    let processedData = KenPomData.map((team) => {
      const seed = getSeed(team.TeamName)
      return {
        ...team,
        Seed: seed,
        Value: (seed * 4) - team.RankAdjEM,
        Cost: cost.get(seed)
      }
    }).filter(team => team.Seed < 17)

    setData(processedData)
  }, []);

  return (
    <>
      <MaterialTable
        columns={columns}
        data={data}        
        options={{
          sorting: true,
          search: false,
          toolbar: false,
          selection: true,
          pageSize: 8
        }}
        onSelectionChange={(rows) => processSelections(rows)}
        components={{
          Pagination: PatchedPagination,
        }}
      />
      <RosterCard>
        {
          selectedTeams.map((team) => {
            return <p key={team.TeamName}>{team.Seed + " " + team.TeamName + " $" + team.Cost}</p>
          })
        }
        <h3>Total Cost: {totalCost}</h3>
      </RosterCard>
    </>
  );
}

export default RankingsTable