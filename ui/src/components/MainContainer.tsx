import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

type Props = {
    title: string;
    children?: React.ReactNode;
  };

export default function MainContainer({ title, children }: Props) {
  const [user, setUser] = useState();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography variant="h2" component="h1" gutterBottom>
          Glorious Grain
        </Typography>
        {children}
      </Container>
    </React.Fragment>
  );
}