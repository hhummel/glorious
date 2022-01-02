import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { logout } from '../utils/api';
import { User } from '../../types';

type Props = {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  };

export default function Logout({setUser}: Props) {
  const handleClick = () => {
      logout();
      setUser(undefined);
  }

  return (
    <div>
      <Button  onClick={handleClick}>
        Logout
      </Button>
    </div>
  );
};