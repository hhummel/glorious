import React, { useState } from "react";
import ReactDOM from 'react-dom';
import Orders from '../Orders';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<Orders userId={1} />, div0);

});