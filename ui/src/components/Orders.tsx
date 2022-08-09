import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import BaseTable from './BaseTable'

import { userOrdersPending, userOrdersHistory } from '../utils/api';
import { Order } from '../../types';
import { userState } from '../store';

const columnHeaders = [
  'Order Date',
  'Product',
  'Quantity',
  'Delivery Date',
  'ID',
]  

export default function Orders() {
  const [user, setUser] = useRecoilState(userState);
  const [rowsPending, setRowsPending] = useState<Array<Order>> ([]);
  const [rowsHistory, setRowsHistory] = useState<Array<Order>> ([]);
  useEffect(() => {
      if (user) {
        userOrdersPending(user.id).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }) => (
              {
                'date': new Date(e.order_date).toDateString(), 
                'product': e.product, 
                'quantity': e.number, 
                'delivery': e.delivery_date,
                'id': e.index_key,
              }
          ));
          setRowsPending(rowData)
        }).catch(e => console.log(e));
        userOrdersHistory(user.id).then(data => {
          const rowData: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
            {
              'date': new Date(e.order_date).toDateString(), 
              'product': e.product, 
              'quantity': e.number, 
              'delivery': e.delivery_date,
              'id': e.index_key,
            }
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
          {rowsPending ?  <BaseTable<Order> title={'Pending'} columnHeaders={columnHeaders} rows={rowsPending}/> : "No pending orders" }
          {rowsHistory ?  <BaseTable<Order> title={'History'} columnHeaders={columnHeaders} rows={rowsHistory}/> : "No order history" }
        </Stack>
      </Box>
    </Container>
  );
};
