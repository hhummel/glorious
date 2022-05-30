import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { Product } from '../../types';
import { modalStyle, cartStyle } from '../styles';

type Props = {
    product: Product;
}

export default function ProductDetailModal({product}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    return (
      <>
      <Button size="small" onClick={() => handleOpen()}>Learn More</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box sx={cartStyle}>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={product.picture || "https://gloriousgrain.s3.amazonaws.com/PXL_20220107_144009933.MP.jpg"}
                    alt={product.label || "Winter light"}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {product.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {product.label}: ${product.price} 
                    </Typography>
                    <Box sx={{ typography: 'body1' }}>Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleClose}>Close</Button>
                </CardActions>
            </Card>
          </Box>
        </div>
      </Modal>
      </>
    );
  };
  