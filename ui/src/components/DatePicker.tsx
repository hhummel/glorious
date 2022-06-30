import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { FormikErrors } from 'formik';

type Props = {
    handleDateChange: (date: Date) => Promise<void> | Promise<FormikErrors<any>>;
    date: Date;
    shouldDisableDate?: (date: Date) => boolean;
}

const defaultDate = new Date()

export default function DatePicker({date, handleDateChange, shouldDisableDate}: Props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
            label="Delivery date"
            inputFormat="MM/dd/yyyy"
            value={date}
            onChange={handleDateChange(date || defaultDate)}
            renderInput={(params: any) => <TextField {...params} />}
            shouldDisableDate={shouldDisableDate}
        />
    </LocalizationProvider>
  );
}
