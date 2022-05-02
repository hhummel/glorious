import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
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
        <Container>
            <Stack>
                {
                  transactionSets && 
                  transactionSets.map((transactionSet, index) => <TransactionSetCard 
                      key={index}
                      transactionSet={transactionSet}
                    />)
                }
            </Stack>
        </Container>
    )
}



