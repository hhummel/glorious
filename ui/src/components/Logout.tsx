import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { logout } from '../utils/api';
import { User } from '../../types';

type Props = {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
  };

export default function Logout({setUser, setVisible}: Props) {
  const handleClick = () => {
      logout();
      setUser(undefined);
      setVisible(1);
  }

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        Logout
      </Button>
    </>
  );
};