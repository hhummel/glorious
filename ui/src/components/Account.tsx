import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import Orders from './Orders';
import Payments from './Payments';
import Balance from './Balance';


type Props = {
    userId: number | undefined;
}

export default function Account({userId}: Props) {
    return (
        <Container>
            <Stack spacing={1}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Account
                </Typography>
                <Balance userId={userId} />
                <Orders userId={userId} />
                <Payments userId={userId} />
            </Stack>
        </Container>
    )
}