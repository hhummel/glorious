import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { TransactionSet, Order, Payment, Product, Refund} from '../../types';

type Props = {
    transactionSet: TransactionSet;
    productData: Array<Product>;
}

export default function TransactionSetCard({transactionSet, productData}: Props) {
    return (
    <Card>
        <CardMedia/>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`ID: ${transactionSet.index_key}`}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`Date: ${new Date(transactionSet.date).toDateString()}`}</Typography>

            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Orders</Typography>
            <div>
                {transactionSet.order_set?.map((order, index) => {
                    const product = productData.find(prod => prod.id === order.product.id)
                    return (
                   <div key={index}>
                        <div>{`Reference number: ${order.index_key}`}</div>
                        <div>{`Product: ${product?.label}`}</div>
                        <div>{`Price: ${product?.price}`}</div>
                        <div>{`Number: ${order.number}`}</div>
                        <div>{`Delivery date: ${order.delivery_date}`}</div>
                    </div>
                )})}

            </div>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Payments</Typography>
            <div>
                {transactionSet.payment_set?.map((payment, index) => <div key={index}>{`${payment.index_key}`}</div>)}
            </div>            
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Refunds</Typography>
            <div>
                {transactionSet.refund_set?.map((refund, index) => <div key={index}>{`${refund.index_key}`}</div>)}
            </div>            

        </CardContent>
        <CardActions></CardActions>
    </Card>
    )
}