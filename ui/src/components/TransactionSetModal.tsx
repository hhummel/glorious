import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { TransactionSet, Product, Order } from '../../types';
import { modalStyle, cartStyle } from '../styles';
import { cancelOrders } from '../utils/api';
import { boolean } from 'yup';

type ModalProps = {
    transactionSet: TransactionSet;
    productData: Array<Product>;
}

const isDisabled = (transactionSet: TransactionSet): boolean => {
    if (transactionSet.refund_set.length > 0) return true;
    if (transactionSet.order_set.some(order => order.delivered === true)) return true;
    if (transactionSet.order_set.some(order => order.confirmed === false)) return true;
    return false;
}

type ModalRowProps = {
  order: Order;
  productData: Array<Product>;
  cancelled: {[id: number]: boolean};
}

function ModalRow({order, productData, cancelled}: ModalRowProps){
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    order.index_key && (cancelled[order.index_key] = !checked);
    setChecked(!checked);
  }
  const dateString = new Date(order.delivery_date).toDateString()
  return (
    <div>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      {`
        ${dateString}: ${order.number} 
        ${productData.find(product => product.index_key === order.product.index_key)?.label} 
        $${productData.find(product => product.index_key === order.product.index_key)?.price} 
       
      `}
    </div>
  )
}

export default function TransactionSetModal({transactionSet, productData}: ModalProps) {
  const cancelled: {[id: number]: boolean} = {}
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError(undefined);
    setOpen(false);
  }
  const handleClick = () => {
    const cancelList = Object.keys(cancelled).map(key => parseInt(key)).filter(key => cancelled[key]);
    cancelOrders(transactionSet.index_key, cancelList).then(result => {
      const {status, data} = result;
      console.log(`Cancel order ${JSON.stringify(result)}`)
      if (status === 200) {
        setError(undefined);
        handleClose();
      } else {
        setError(data);
      }
    });
  };

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
                    {"Orders to cancel:"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <Box sx={{ typography: 'body1' }}>
                      {transactionSet.order_set.map((order, index) => <ModalRow 
                        key={index} 
                        order={order} 
                        productData={productData} 
                        cancelled={cancelled}
                      />)}
                    </Box>    
                    </Typography>
                    <Typography variant="body2" color="error.main">{error}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleClose}>Never mind</Button>
                  <Button size="small" onClick={handleClick}>Cancel them</Button>
                </CardActions>
            </Card>
          </Box>
        </div>
      </Modal>
    </>
  );
};
  