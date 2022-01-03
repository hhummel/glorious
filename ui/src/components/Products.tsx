import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';

import { products } from '../utils/api';
import { Product } from '../../types';

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
    { field: 'label', headerName: 'Product', width: 150 },
    { field: 'price', headerName: 'Price', width: 150 },   
    { field: 'picture', headerName: 'Picture', width: 150 },
  ];

type Props = {
    userId: string | undefined;
}

export default function Products({userId}: Props) {
  const [rows, setRows] = useState<GridRowsProp | undefined>();
  useEffect(() => {
    products().then(data => {
    const rowData: Array<Product> = data.map( (e: { [x: string]: any; }, i: number) => (
        {'id': i + 1, 'label': e.label, 'price': e.price, 'picture': e.picture}
    ));
    setRows(rowData)
    }).catch(e => console.log(e));
  }, []);

  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <div style={{ height: 300, width: '100%' }}>
          {rows ? <DataGrid rows={rows} columns={columns} /> : "No data" }
        </div>
      </Box>
    </Container>
  );
};

function e(e: any, arg1: (any: any) => any): Product[] {
    throw new Error('Function not implemented.');
}
