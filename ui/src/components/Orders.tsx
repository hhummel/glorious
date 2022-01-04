import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';

import { userOrders } from '../utils/api';
import { Order } from '../../types';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on both DataGrid and DataGridPro
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});

const columns: GridColDef[] = [
    { field: 'product', headerName: 'Product', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 150 },   
    { field: 'delivery', headerName: 'Delivery date', width: 150 },
  ];


type Props = {
    userId: number | undefined;
}

export default function Orders({userId}: Props) {
  const [rows, setRows] = useState<GridRowsProp | undefined>();
  useEffect(() => {
      if (userId) {
        userOrders(userId).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
              {'id': i + 1, 'product': e.product, 'quantity': e.number, 'delivery': e.delivery_date}
          ));
          setRows(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
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
