import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BaseTable from './BaseTable'
import { userRefunds } from '../utils/api';
import { Refund } from '../../types';
import { userState } from '../store';

  const columnHeaders = [
    'Date',
    'Amount',
    'Method',
    'ID'
  ]

export default function Refunds() {
  const [user, setUser] = useRecoilState(userState);
  const [rows, setRows] = useState<Array<Refund>>([]);

  useEffect(() => {
      if (user) {
        userRefunds(user.id).then(data => {
          const rowData: Array<Refund> = data.map( (el: { [x: string]: any; }) => (
              {
                'date': new Date(el.date).toDateString(), 
                'value': el.value, 
                'refund_method': el.refund_method, 
                'id': el.index_key,
            }
          ));
          setRows(rowData)
        }).catch(e => console.log(e));
      }
  }, []);

  return <BaseTable<Refund> title={'Refunds'} columnHeaders={columnHeaders} rows={rows}/>
};
