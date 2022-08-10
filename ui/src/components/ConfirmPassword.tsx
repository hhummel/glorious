import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { confirmPassword } from '../utils/api';
import { visibleState } from '../store';


const validationSchema = yup.object({
  token: yup
    .number()
    .positive()
    .integer()
    .nullable(true),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const initialValues = {
    'token': undefined,
    'password': '',
    'passwordConfirmation': null,
  };

export default function ConfirmPassword() {
      const [visible, setVisible] = useRecoilState(visibleState);
      const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: values => {
        if (values.token){
          confirmPassword(values.token, values.password).then(response => console.log(`TODO: Confirm password status ${response.status}`))
          setVisible(1);
        }
      },  
    });

    return (    
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
              Set a New Password
          </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1}>
                <TextField
                    fullWidth
                    id="token"
                    name="token"
                    label="Token"
                    placeholder="****"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    error={formik.touched.token && Boolean(formik.errors.token)}
                    helperText={formik.touched.token && formik.errors.token}
                />
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                    fullWidth
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    label="Re-enter Password"
                    type="password"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.passwordConfirmation)}
                    helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            />
                <Button color="primary" variant="contained" type="submit">Reset Password</Button>
            </Stack>
        </form>
        </Box>
      </Container>
    );
  };