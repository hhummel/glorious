import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Account from '../Account';
import { product } from './fixtures'

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<Account userId={1} productData={[product]}/>, div0);

});