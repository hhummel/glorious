import React from 'react';
import { useRecoilState } from 'recoil';
import Button from '@mui/material/Button';
import { userState } from '../store';


export default function Subscription () {
    const [user, setUser] = useRecoilState(userState);

    return (
      <>
      <div>Subscription information here for {user?.first_name}!</div>
      <Button size="small" onClick={() => {}}>Edit</Button>
      </>
    );
  };