import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { TransactionSet, Product } from '../../types';
import { modalStyle, cartStyle } from '../styles';

type Props = {
    transactionSet: TransactionSet;
    productData: Array<Product>;
}

const isDisabled = (transactionSet: TransactionSet): boolean => {
    if (transactionSet.refund_set.length > 0) return true;
    if (transactionSet.order_set.some(order => order.delivered === true)) return true;
    if (transactionSet.order_set.some(order => order.confirmed === false)) return true;
    return false;
}

export default function TransactionSetModal({transactionSet, productData}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    return (
      <>
      <Button size="small" disabled={isDisabled(transactionSet)} onClick={() => handleOpen()}>Cancel</Button>

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
                    image={"https://gloriousgrain.s3.amazonaws.com/PXL_20220107_144009933.MP.jpg"}
                    alt={"Winter light"}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {"Select orders to cancel:"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <Box sx={{ typography: 'body1' }}>
                        {transactionSet.order_set.map((order, index) => <p key={index}>
                          {`${order.number} ${productData.find(product => product.id === order.product.id)?.label} $${productData.find(product => product.id === order.product.id)?.price} for delivery on ${order.delivery_date}`}
                        </p>)}
                    </Box>    
                    </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleClose}>Close without cancelling</Button>
                  <Button size="small" onClick={handleClose}>Cancel selected orders</Button>
                </CardActions>
            </Card>
          </Box>
        </div>
      </Modal>
      </>
    );
  };
  