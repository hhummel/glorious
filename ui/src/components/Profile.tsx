import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { Contact} from '../../types';
import { contact } from '../utils/api'
import { AnalyticsRounded, AnalyticsTwoTone } from '@mui/icons-material';



type Props = {
    userId: string | undefined;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function Profile({userId, setVisible}: Props) {
    const formik = useFormik({
      initialValues: {
        'first_name': '',
        'last_name': '',
        'email': '',
        'address': '',
        'city': '',
        'state': '',
        'zip': '',
        'mobile': '',
      },
      onSubmit: values => {
        console.log(`Submit ${values}`)
      },
    });
    useEffect(() => {
        if (userId) {
          contact(userId).then(data => {
            formik.setFieldValue('first_name', data.first_name);
            formik.setFieldValue('last_name', data.last_name);
            formik.setFieldValue('email', data.email);
            formik.setFieldValue('address', data.address);
            formik.setFieldValue('city', data.city);
            formik.setFieldValue('state', data.state);
            formik.setFieldValue('zip', data.zip);
            formik.setFieldValue('mobile', data.mobile);
          })}
    }, [userId]);

  
    return (    
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile for {formik.values?.first_name}
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
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
              <Button color="primary" variant="contained" type="submit">
                Edit Profile
              </Button>
              <Button color="primary" variant="contained" onClick={ () => setVisible(1)}>
                Confirm Profile
              </Button>
            </form>
          </Typography>
        </Box>
      </Container>
    );
  };

  