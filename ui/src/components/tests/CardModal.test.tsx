import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Order } from '../../../types';
import CardModal from '../CardModal';
import { order } from './fixtures';

it('NavBar render correctly', () => {

    type Props = {
        initialCart: Array<Order>;
      };
    
    function Wrapper ({initialCart}: Props) {
    
        const [cart, setCart] = useState(initialCart || undefined);

        return <CardModal cart={cart} buttonWidth="100px"/>;
    }

    const div0 = document.createElement('div');
    const cart: Array<Order> = [order]
    ReactDOM.render(<Wrapper initialCart={cart} />, div0);

});