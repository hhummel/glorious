import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import Account from '../Account';
import { product } from './fixtures'

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<RecoilRoot><Account productData={[product]}/></RecoilRoot>, div0);

});