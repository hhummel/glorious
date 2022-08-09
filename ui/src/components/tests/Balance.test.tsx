import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import Balance from '../Balance';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<RecoilRoot><Balance /></RecoilRoot>, div0);

});