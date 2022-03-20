import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Payments from '../Payments';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<Payments userId={1} />, div0);

});