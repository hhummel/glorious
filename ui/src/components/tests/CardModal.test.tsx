import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import { Order } from '../../../types';
import CardModal from '../CardModal';
import { order } from './fixtures';

it('NavBar render correctly', () => {

    function Wrapper () {
        // TODO: Set Recoil state in wrapper

        return <RecoilRoot><CardModal buttonWidth="100px"/></RecoilRoot>;
    }

    const div0 = document.createElement('div');
    ReactDOM.render(<Wrapper />, div0);

});