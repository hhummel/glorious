import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { User } from '../../../types';
import NavBar from '../NavBar';
import { user } from './fixtures';

it('NavBar render correctly', () => {

    type Props = {
        initialUser: User | undefined;
        screenVisible: number;
      };
    
    function Wrapper ({initialUser, screenVisible}: Props) {
    
        const [visible, setVisible] = useState(screenVisible);
        const [user, setUser] = useState(initialUser || undefined);

        return <NavBar user={user} setUser={setUser} setVisible={setVisible} />;
    }

    const div0 = document.createElement('div');
    ReactDOM.render(<Wrapper initialUser={undefined} screenVisible={1} />, div0);

    const div1 = document.createElement('div');
    ReactDOM.render(<Wrapper initialUser={undefined} screenVisible={2} />, div1);

    const div2 = document.createElement('div');
    ReactDOM.render(<Wrapper initialUser={user} screenVisible={1}/>, div2);

    const div3 = document.createElement('div');
    ReactDOM.render(<Wrapper initialUser={user} screenVisible={2}/>, div3);
});