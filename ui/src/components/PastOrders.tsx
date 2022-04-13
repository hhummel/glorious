import React, { useState, useEffect } from 'react';
import BaseTable from './BaseTable'

import { userOrdersHistory } from '../utils/api';
import { Order } from '../../types';

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

export default function PastOrders({userId}: Props) {
  const [rows, setRows] = useState<Array<Order>> ([]);
  useEffect(() => {
      if (userId) {
        userOrdersHistory(userId).then(data => {
          const rows: Array<Order> = data.map( (e: { [x: string]: any; }, i: number) => (
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
        {rows ?  <BaseTable<Order> title={'Order History'} columnHeaders={columnHeaders} rows={rows}/> : "No order history" }
      </div>
  );
};