import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers'
import { FormikErrors } from 'formik';

type Props = {
    handleDateChange: (date: Date | null, keyboardInputValue: string | undefined) => void;
    date: Date;
    shouldDisableDate?: (date: Date) => boolean;
}

export default function DatePicker({date, handleDateChange, shouldDisableDate}: Props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
            label="Delivery date"
            inputFormat="MM/dd/yyyy"
            value={date}
            // onChange={handleDateChange(date || defaultDate, keyboardInputValue || undefined)}
            onChange={handleDateChange}
            renderInput={(params: any) => <TextField {...params} />}
            shouldDisableDate={shouldDisableDate}
        />
    </LocalizationProvider>
  );
}
