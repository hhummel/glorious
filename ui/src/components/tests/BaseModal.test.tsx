import React, { useState } from "react";
import { RecoilRoot } from "recoil";
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
        // TODO: Set Recoil state in wrapper
        const [visible, setVisible] = useState(screenVisible);
        const [cart, setCart] = useState(initialCart || undefined);

        return <BaseModal paymentMethod="VEN" buttonWidth="100px"/>;
    }

    const div0 = document.createElement('div');
    const cart: Array<Order> = [order]
    ReactDOM.render(<RecoilRoot><Wrapper initialCart={cart} screenVisible={1} /></RecoilRoot>, div0);

});