import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Login from './Login';
import Logout from './Logout';
import { User } from '../../types';

type Props = {
    title: string;
    children?: React.ReactNode;
  };

export default function MainContainer({ title, children }: Props) {
  const [user, setUser] = useState<User>();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='sm'>
        {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} /> } 
        <div>
          { user?.first_name || 'no user' }
        </div>
        <Typography variant="h2" component="h1" gutterBottom>
          Glorious Grain
        </Typography>
        {children}
      </Container>
    </React.Fragment>
  );
}