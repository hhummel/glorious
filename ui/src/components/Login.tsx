import React from 'react';
import { useRecoilState} from 'recoil';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import { authenticate } from '../utils/api';
import { User } from '../../types';
import { userState} from '../store';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  email: yup
    .string()
    .min(4, 'Username should be of minimum 4 characters length')
    //.email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({open, setOpen}: Props) {
  const [user, setUser] = useRecoilState(userState);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const res = await authenticate(values.email, values.password);
      const {status, data} = res
      if (status === 200) {
        const user: User = data;
        setUser(user);
      }
      setOpen(false);
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
          <Button color="primary" variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </form>
      </Box>
    </Modal>
  );
};

