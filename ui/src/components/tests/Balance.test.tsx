import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Balance from '../Balance';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<Balance userId={1} />, div0);

});