import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { userCredits, userDebits } from '../utils/api';
import { Ledger } from '../../types';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

type Props = {
    userId: number | undefined;
}

export default function Orders({userId}: Props) {
  const [credits, setCredits] = useState<Array<Ledger>>([]);
  const [debits, setDebits] = useState<Array<Ledger>>([]);
  useEffect(() => {
      if (userId) {
        userCredits(userId).then(data => {setCredits(data)}).catch(e => console.log(e));
        userDebits(userId).then(data => {setDebits(data)}).catch(e => console.log(e));
      }
  }, []);

  const creditTotal = credits.
      filter(ledger => ledger.cancelled === false && ledger.non_cash === false).
      reduce((previous, ledger) => previous + Number(ledger.quantity), 0)

  const debitTotal = debits.
      filter(ledger => ledger.cancelled === false).
      reduce((previous, ledger) => previous + Number(ledger.quantity), 0)
      
  return (    
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Balance: {formatter.format(creditTotal + debitTotal)}
        </Typography>
      </Box>
    </Container>
  );
};
