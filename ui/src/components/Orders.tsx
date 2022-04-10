import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import { userOrdersPending, userOrdersHistory } from '../utils/api';
import { Order } from '../../types';

const columns: GridColDef[] = [
    { field: 'product', headerName: 'Product', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },   
    { field: 'delivery', headerName: 'Delivery date', width: 150 },
  ];

type Props = {
    userId: number | undefined;
}

export default function Orders({userId}: Props) {
  const [rowsPending, setRowsPending] = useState<GridRowsProp | undefined>();
  const [rowsHistory, setRowsHistory] = useState<GridRowsProp | undefined>(); 
  useEffect(() => {
      if (userId) {
        userOrdersPending(userId).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
              {'id': i + 1, 'product': e.product, 'quantity': e.number, 'delivery': e.delivery_date}
          ));
          setRowsPending(rowData)
        }).catch(e => console.log(e));
        userOrdersHistory(userId).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
              {'id': i + 1, 'product': e.product, 'quantity': e.number, 'delivery': e.delivery_date}
          ));
          setRowsHistory(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" gutterBottom>
            Orders
          </Typography>
          <div style={{ height: 300, width: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Pending
            </Typography>
            {rowsPending ? <DataGrid rows={rowsPending} columns={columns} /> : "No data" }
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              History
            </Typography>
            {rowsHistory ? <DataGrid rows={rowsHistory} columns={columns} /> : "No data" }
          </div>
        </Stack>
      </Box>
    </Container>
  );
};
