import React, { useState } from "react";
import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import NavBar from '../NavBar';

it('NavBar render correctly', () => {

    type Props = {
        screenVisible: number;
      };
    
    function Wrapper ({screenVisible}: Props) {
    
        const [visible, setVisible] = useState(screenVisible);

        return (
          <RecoilRoot>
            <NavBar />
          </RecoilRoot>
        )
    }

    const div0 = document.createElement('div');
    ReactDOM.render(<Wrapper screenVisible={1} />, div0);

    const div1 = document.createElement('div');
    ReactDOM.render(<Wrapper screenVisible={2} />, div1);

    const div2 = document.createElement('div');
    ReactDOM.render(<Wrapper screenVisible={1}/>, div2);

    const div3 = document.createElement('div');
    ReactDOM.render(<Wrapper screenVisible={2}/>, div3);
});