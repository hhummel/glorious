import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Order } from '../../../types';
import BaseModal from '../BaseModal';
import { order } from './fixtures';

it('NavBar render correctly', () => {

    type Props = {
        initialCart: Array<Order>;
        screenVisible: number;
      };
    
    function Wrapper ({initialCart, screenVisible}: Props) {
    
        const [visible, setVisible] = useState(screenVisible);
        const [cart, setCart] = useState(initialCart || undefined);

        return <BaseModal paymentMethod="VEN" setVisible={setVisible} cart={cart} setCart={setCart} buttonWidth="100px"/>;
    }

    const div0 = document.createElement('div');
    const cart: Array<Order> = [order]
    ReactDOM.render(<Wrapper initialCart={cart} screenVisible={1} />, div0);

});