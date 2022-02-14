import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


// TODO: This is a hard-coded test key
const stripePromise = loadStripe('pk_test_DYeuYzpmoAucmljbl3yZ3Ds5');

type Props = {
    secret: string | undefined;
}
export default function StripePaymentForm({secret}: Props){
  const options = {
    clientSecret: secret,
    appearance: {/*...*/}
  }

  if (secret) {
      return (
        <Elements stripe={stripePromise} options={options}>
            <form>
            <PaymentElement />
            <button>Submit</button>
            </form>
        </Elements>
    );
  }

  return (
       <div>Loading...</div>
  )
};
