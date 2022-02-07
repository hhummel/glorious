import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { userPayments } from '../utils/api';
import { Order } from '../../types';

const columns: GridColDef[] = [
    { field: 'value', headerName: 'Amount', width: 150 },
    { field: 'payment_method', headerName: 'Payment Type', width: 150 },   
    { field: 'date', headerName: 'Date', width: 150 },
  ];

type Props = {
    userId: number | undefined;
}

export default function Payments({userId}: Props) {
  const [rows, setRows] = useState<GridRowsProp | undefined>();
  useEffect(() => {
      if (userId) {
        userPayments(userId).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
              {'id': i + 1, 'value': e.value, 'payment_method': e.payment_method, 'date': e.date}
          ));
          setRows(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payments
        </Typography>
        <div style={{ height: 300, width: '100%' }}>
          {rows ? <DataGrid rows={rows} columns={columns} /> : "No data" }
        </div>
      </Box>
    </Container>
  );
};

function e(e: any, arg1: (any: any) => any): Order[] {
    throw new Error('Function not implemented.');
}
