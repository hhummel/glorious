import React, { useState, useEffect } from 'react';

import BaseTable from './BaseTable'
import { userRefunds } from '../utils/api';
import { Refund } from '../../types';

  const columnHeaders = [
    'Date',
    'Amount',
    'Method',
    'ID'
  ]

type Props = {
    userId: number | undefined;
}

export default function Refunds({userId}: Props) {

  const [rows, setRows] = useState<Array<Refund>>([]);

  useEffect(() => {
      if (userId) {
        userRefunds(userId).then(data => {
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
