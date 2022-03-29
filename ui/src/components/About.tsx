import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';



export default function About() {

  return (    
    <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>About Us</Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          <p>I love to feed people tasty food that makes them happy.  When you order challah, 
            sourdough or cornbread, I make it specifically for you, with all the beauty and soul 
            as I can pack into it. Everything is made by hand and to order.
          </p>
          <p>Your bread reaches your door within hours of coming out of the oven. 
            We're not just local -- we're down the street.
          </p>
          <p>There's nothing more personal than the food that you eat.  
            We respect that by using only the highest quality ingredients.
          </p>
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>Contact</Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          <p>
            Laura Hutner<br/>
            Glorious Grain<br/>
            306 Llanfair Road<br/>
            Wynnewood, PA<br/>
            19096<br/>
            <a href="mailto:laura@gloriousloaf.com?Subject=Bread" target="_top">Send Email</a>
          </p>
        </Typography>
    </Container>
  );
};