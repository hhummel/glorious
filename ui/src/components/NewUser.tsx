import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { getContact, createContact } from '../utils/api'

const validationSchema = yup.object({
  password: yup
  .string()
  .min(8, 'Password should be of minimum 8 characters length')
  .required('Password is required'),
  first_name: yup.string().required().max(35),
  last_name: yup.string().required().max(35),
  email: yup.string().email().required(),
  address: yup.string().required().max(100),
  city: yup.string().required().max(100),
  state:yup.string().required().max(100),
  zip: yup.string().required().max(5),
  mobile: yup.string().required().max(10),
});

const initialValues = {
    'password': '',
    'first_name': '',
    'middle_name': 'Horner',
    'last_name': '',
    'email': '',
    'address': '',
    'city': '',
    'state': '',
    'zip': '',
    'municipality': 'LOWER_MERION',
    'mobile': '',
    'carrier': 'VER',
    'active': false
  };

type Props = {
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewUser({setVisible}: Props) {
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: values => {
          createContact(values).then(result => {
            const {status} = result;
            status == 201 && setVisible(1);
          });
        },  
    });

    return (    
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
              Please Create a Profile
          </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1}>
            <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
                fullWidth
                id="first_name"
                name="first_name"
                label="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
            />
            <TextField
                fullWidth
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
            />
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
            <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
            />
            <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
            />
            <TextField
                fullWidth
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
            />
            <TextField
                fullWidth
                id="zip"
                name="zip"
                label="Zip"
                value={formik.values.zip}
                onChange={formik.handleChange}
                error={formik.touched.zip && Boolean(formik.errors.zip)}
                helperText={formik.touched.zip && formik.errors.zip}
            />
            <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
            />
            <Button color="primary" variant="contained" type="submit">Create Profile</Button>
            </Stack>
        </form>
        </Box>
      </Container>
    );
  };