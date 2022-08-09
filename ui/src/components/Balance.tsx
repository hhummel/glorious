import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { userCredits, userDebits } from '../utils/api';
import { Ledger } from '../../types';
import { userState } from '../store';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Balance() {
  const [user, setUser] = useRecoilState(userState);

  const [credits, setCredits] = useState<Array<Ledger>>([]);
  const [debits, setDebits] = useState<Array<Ledger>>([]);
  useEffect(() => {
      if (user) {
        userCredits(user.id).then(data => {setCredits(data)}).catch(e => console.log(e));
        userDebits(user.id).then(data => {setDebits(data)}).catch(e => console.log(e));
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
