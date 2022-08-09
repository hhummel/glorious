import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BaseTable from './BaseTable'

import { userOrdersHistory } from '../utils/api';
import { Order } from '../../types';
import { userState } from '../store';

const columnHeaders = [
  'Order Date',
  'Product',
  'Quantity',
  'Delivery Date',
  'ID',
]  

export default function PastOrders() {
  const [user, setUser] = useRecoilState(userState);
  const [rows, setRows] = useState<Array<Order>> ([]);
  useEffect(() => {
      if (user) {
        userOrdersHistory(user.id).then(data => {
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