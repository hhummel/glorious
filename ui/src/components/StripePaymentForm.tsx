import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeInnerForm from './StripeInnerForm';
import { stripePublishableKey } from '../config';

const stripePromise = loadStripe(stripePublishableKey);

type Props = {
    secret: string | undefined;
}

export default function StripePaymentForm({secret}: Props){
    const options = {
        clientSecret: secret,
        appearance: {/*...*/}
    }
    
    return (
        <div>
            {secret && (
                <Elements options={options} stripe={stripePromise}>
                  <StripeInnerForm />
                </Elements>
            )}
        </div>
    )
};
