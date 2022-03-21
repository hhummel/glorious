import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';


const validationSchema = yup.object({
  email: yup.string().email().required(),
});

const initialValues = {
    'email': ''
  };

type Props = {
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ResetPassword({setVisible}: Props) {
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: values => {
          console.log('Reset password logic');
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
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Button color="primary" variant="contained" type="submit">Get Reset Email</Button>
            </Stack>
        </form>
        </Box>
      </Container>
    );
  };