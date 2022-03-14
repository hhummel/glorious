import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';



export default function FAQ() {

  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>FAQ</Typography>
        <div>Your important questions answered!</div>
      </Stack>
    </Container>
  );
};