import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import Orders from '../Orders';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<RecoilRoot><Orders /></RecoilRoot>, div0);

});