import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import { cardStyle } from '../styles';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';


export default function StripeInnerForm(){
    const stripe = useStripe();
    const elements = useElements();
  
    const [errorMessage, setErrorMessage] = useState<string|null|undefined>(null);
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return <div></div>
      }
  
      const {error} = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: 'https://sashette.com',
        },
      });
  
  
      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    };
    
    return (
  
        <form onSubmit={handleSubmit}>
            <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={2}>
              <Box sx={cardStyle}><PaymentElement /></Box>
              <Button color="primary" variant="contained" disabled={!stripe} type="submit">Submit</Button>
              {errorMessage && <div>{errorMessage}</div>}
            </Stack>
        </form>
    )
};
