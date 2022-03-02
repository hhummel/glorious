import React from 'react';
import { Link } from'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import { Container } from '@mui/material';
import { modalStyle } from '../styles';


export default function PaymentReceived() {
    return (
        <Container maxWidth='sm'>
            <Box sx={modalStyle}>
                <Stack justifyContent="center" alignItems="center" spacing={2} >
                    <Typography variant="h5" component="h1" gutterBottom>Payment Received!</Typography>
                    <Button color="primary" variant="contained" component={Link} to={"/"}>Close</Button>
                </Stack>
            </Box>
        </Container>
    )
}
