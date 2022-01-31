import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Order } from '../../../types';
import CheckoutForm from '../CheckoutForm';
import { order } from './fixtures';

it('CheckoutForm renders whether or not ShoppingCart is visible / cart is empty', () => {

    type Props = {
        userId: number;
        screenVisible: number;
        order?: Order;
      };
    
    function Wrapper ({userId, screenVisible, order}:Props) {
    
        const [visible, setVisible] = useState(screenVisible);
        const initialCart = order ? Array<Order>(order) : Array<Order>();
        const [cart, setCart] = useState(initialCart);
    
        return <CheckoutForm userId={userId} cart={cart} setCart={setCart} setVisible={setVisible} handleClose={() => {}} />
    }

    const div0 = document.createElement('div');
    ReactDOM.render(<Wrapper userId={1} screenVisible={1} order={undefined}/>, div0);

    const div1 = document.createElement('div');
    ReactDOM.render(<Wrapper userId={3} screenVisible={1} order={undefined}/>, div1);

    const div2 = document.createElement('div');
    ReactDOM.render(<Wrapper userId={1} screenVisible={1} order={order}/>, div2);

    const div3 = document.createElement('div');
    ReactDOM.render(<Wrapper userId={3} screenVisible={1} order={order}/>, div3);
});