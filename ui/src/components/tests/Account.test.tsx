import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Account from '../Account';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<Account userId={1} />, div0);

});