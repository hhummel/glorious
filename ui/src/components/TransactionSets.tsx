import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';

import { TransactionSet } from '../../types';
import { getTransactionSets } from '../utils/api';
import TransactionSetCard from "./TransactionSetCard";

export default function TransactionSets() {
    const [transactionSets, setTransactionSets] = useState<Array<TransactionSet> | undefined>();

    useEffect(() => {
        getTransactionSets().then(data => setTransactionSets(data))
    }, [])

    return (
            <Stack>
                {
                  transactionSets && 
                  transactionSets.map((transactionSet, index) => <TransactionSetCard 
                      key={index}
                      transactionSet={transactionSet}
                    />)
                }
            </Stack>
    )
}



