import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { userRefunds } from '../utils/api';
import { Refund } from '../../types';

const columns: GridColDef[] = [
    { field: 'value', headerName: 'Amount', width: 150 },
    { field: 'refund_method', headerName: 'Refund Type', width: 150 },   
    { field: 'date', headerName: 'Date', width: 150 },
  ];

type Props = {
    userId: number | undefined;
}

export default function Refunds({userId}: Props) {
  const [rows, setRows] = useState<GridRowsProp | undefined>();
  useEffect(() => {
      if (userId) {
        userRefunds(userId).then(data => {
          const rowData: Array<Refund> = data.map( (refund: { [x: string]: any; }, i: number) => (
              {'id': i + 1, 'value': refund.value, 'refund_method': refund.refund_method, 'date': refund.date}
          ));
          setRows(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Refunds
        </Typography>
        <div style={{ height: 300, width: '100%' }}>
          {rows ? <DataGrid rows={rows} columns={columns} /> : "No data" }
        </div>
      </Box>
    </Container>
  );
};
