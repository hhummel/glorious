import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userPayments } from '../utils/api';
import { Payment } from '../../types';
import BaseTable from './BaseTable'
import formatDateString from '../utils/formatDateString'
import { userState, visibleState } from '../store';

export default function Payments() {
  const [user, setUser] = useRecoilState(userState);
  const [visible, setVisible] = useRecoilState(visibleState);
  const [rows, setRows] = useState<Array<Payment>>([]);

  useEffect(() => {
      if (user) {
        userPayments(user.id).then(data => {
          const rowData: Array<Payment> = data.map( (el: { [x: string]: any; }) => (
              {
                'date': formatDateString(el.date), 
                'value': el.value, 
                'payment_method': el.payment_method, 
                'id': el.index_key,
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
    'ID'
  ]

  return <BaseTable<Payment> title={'Payments'} columnHeaders={columnHeaders} rows={rows}/>
};
