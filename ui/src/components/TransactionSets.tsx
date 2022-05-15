import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { TransactionSet, Product } from '../../types';
import { getTransactionSets } from '../utils/api';
import TransactionSetCard from "./TransactionSetCard";

type Props = {
    productData: Array<Product>;
}

export default function TransactionSets({productData}: Props) {
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
                      productData={productData}
                    />)
                }
            </Stack>
        </Container>
    )
}



