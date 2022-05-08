import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { TransactionSet, Order, Payment, Refund} from '../../types';

type Props = {
    transactionSet: TransactionSet;
}

export default function TransactionSetCard({transactionSet}: Props) {
    return (
    <Card>
        <CardMedia/>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`ID: ${transactionSet.index_key}`}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`Date: ${transactionSet.date.toString()}`}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Orders</Typography>
            <div>
                {transactionSet.order_set?.map((order, index) => <div key={index}>{`${order.index_key}`}</div>)}
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