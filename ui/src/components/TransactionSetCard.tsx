import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import TransactionSetModal from './TransactionSetModal';
import { TransactionSet, Order, Payment, Product, Refund} from '../../types';

type Props = {
    transactionSet: TransactionSet;
    productData: Array<Product>;
}


export default function TransactionSetCard({transactionSet, productData}: Props) {
    return (
    <Card>
     <CardMedia
        component="img"
        height="140"
        image={transactionSet.order_set[0].product.picture || "https://gloriousgrain.s3.amazonaws.com/PXL_20210519_125730680.jpg"}
        alt={transactionSet.order_set[0].product.label || "Order basket"}
      />
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`ID: ${transactionSet.index_key}`}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{`Date: ${new Date(transactionSet.date).toDateString()}`}</Typography>

            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Orders</Typography>
            <div>
                {transactionSet.order_set?.map((order, index) => {
                    const product = productData.find(prod => prod.index_key === order.product as unknown as number)
                    return (
                   <div key={index}>
                        <div>{`Reference number: ${order.index_key}`}</div>
                        <div>{`Product: ${product?.label}`}</div>
                        <div>{`Number: ${order.number}`}</div>
                        <div>{`Price: $${product?.price ? product?.price * order.number : undefined}`}</div>
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
        <CardActions>
            <TransactionSetModal transactionSet={transactionSet} productData={productData} />
        </CardActions>
    </Card>
    )
}