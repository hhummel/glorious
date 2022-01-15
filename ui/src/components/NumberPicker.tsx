import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormikErrors } from 'formik';

type Props = {
    number: number | 1;
    maxNumber: number | 10;
    handleNumberChange: (number: number) => Promise<void> | Promise<FormikErrors<any>>;
}

export default function NumberPicker({number, maxNumber, handleNumberChange}: Props) {

  const handleChange = (event: SelectChangeEvent) => handleNumberChange(Number(event.target.value) as number);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Number</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={number.toString()}
          label="Number"
          onChange={handleChange}
        >
        { [...Array(maxNumber)].map((_, i) => <MenuItem value={i+1}>{i+1}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}
