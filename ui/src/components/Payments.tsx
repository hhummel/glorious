import React, { useState, useEffect } from 'react';

import { userPayments } from '../utils/api';
import { Payment } from '../../types';
import BaseTable from './BaseTable'


type Props = {
    userId: number | undefined;
}

export default function Payments({userId}: Props) {

  const [rows, setRows] = useState<Array<Payment>>([]);

  useEffect(() => {
      if (userId) {
        userPayments(userId).then(data => {
          const rowData: Array<Payment> = data.map( (el: { [x: string]: any; }) => (
              {
                'date': new Date(el.date).toDateString(), 
                'value': el.value, 
                'payment_method': el.payment_method, 
                'cart': el.cart,
            }
          ));
          setRows(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  const columnHeaders = [
    'Date',
    'Amount',
    'Method',
    'Cart'
  ]

  return <BaseTable<Payment> columnHeaders={columnHeaders} rows={rows}/>
};
