import React, { useState, useEffect } from 'react';
import BaseTable from './BaseTable'

import { userOrdersPending } from '../utils/api';
import { Order } from '../../types';
import { RowingSharp } from '@mui/icons-material';

const columnHeaders = [
  'Order Date',
  'Product',
  'Quantity',
  'Delivery Date',
  'ID',
]  

type Props = {
    userId: number | undefined;
}

export default function PendingOrders({userId}: Props) {
  const [rows, setRows] = useState<Array<Order>> ([]);
  useEffect(() => {
      if (userId) {
        userOrdersPending(userId).then(data => {
          const rows: Array<Order> = data.map( (e: { [x: string]: any; }) => (
              {
                'date': new Date(e.order_date).toDateString(), 
                'product': e.product, 
                'quantity': e.number, 
                'delivery': e.delivery_date,
                'id': e.index_key,
              }
          ));
        setRows(rows)
      }).catch(e => console.log(e));
    }
}, []);

  return (
      <div>
        {rows ?  <BaseTable<Order> title={'Pending Orders'} columnHeaders={columnHeaders} rows={rows}/> : "No pending orders" }
      </div>
  );
};