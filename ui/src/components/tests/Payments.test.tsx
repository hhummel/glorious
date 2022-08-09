import { RecoilRoot } from "recoil";
import ReactDOM from 'react-dom';
import Payments from '../Payments';

it('Account render correctly', () => {

    const div0 = document.createElement('div');
    ReactDOM.render(<RecoilRoot><Payments /></RecoilRoot>, div0);

});