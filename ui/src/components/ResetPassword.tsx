import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { resetPassword } from '../utils/api';

const validationSchema = yup.object({
    old_password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Old password is required'),
    new_password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('New password is required'),
});

const initialValues = {
    'old_password': '',
    'new_password': ''
  };

type Props = {
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ResetPassword({setVisible}: Props) {
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: values => {
          resetPassword(values.old_password, values.new_password).then(response => {
              const status = response?.status;
              if (status === 200) {
                  console.log('Password reset success');
              } else if (status === 400) {
                  console.log('Password reset failed');
              } else {
                  console.log(`Password reset returned status ${status}`);
              }
          })
          setVisible(1);
      },  
    });

    return (    
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
              Reset Your Password
          </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1}>
                <TextField
                    fullWidth
                    id="old_passwod"
                    name="old_password"
                    label="Old password"
                    value={formik.values.old_password}
                    onChange={formik.handleChange}
                    error={formik.touched.old_password && Boolean(formik.errors.old_password)}
                    helperText={formik.touched.old_password && formik.errors.old_password}
                />
                <TextField
                    fullWidth
                    id="new_passwod"
                    name="new_password"
                    label="New password"
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                    error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                    helperText={formik.touched.new_password && formik.errors.new_password}
                />
                <Button color="primary" variant="contained" type="submit">Reset Password</Button>
            </Stack>
        </form>
        </Box>
      </Container>
    );
  };