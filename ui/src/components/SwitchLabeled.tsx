import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { FormikErrors } from 'formik';

type Props = {
    label: string | ''
    isChecked: boolean | false;
    handleCheck: (status: boolean) => Promise<void> | Promise<FormikErrors<any>>;
}

export default function SwitchLabeled({label, isChecked, handleCheck}: Props) {

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => handleCheck(event.target.checked);

  return (
    <FormGroup>
      <FormControlLabel checked={isChecked} control={<Switch onChange={handleClick} />} label={label} />
    </FormGroup>
  )}
