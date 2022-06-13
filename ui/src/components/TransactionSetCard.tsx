import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {`Order Date: ${new Date(transactionSet.date).toDateString()} ID: ${transactionSet.index_key}`}
            </Typography>

            <Divider textAlign="center">Orders</Divider>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Delivery</TableCell>
                        <TableCell align="left">{`\u2116`}</TableCell>
                        <TableCell align="left">Product</TableCell>
                        <TableCell align="left">Cost</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionSet.order_set?.map((order, index) => {
                            const product = productData.find(prod => prod.index_key === order.product as unknown as number)
                            return (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{order.delivery_date}</TableCell>
                                <TableCell align="left">{order.number}</TableCell>
                                <TableCell align="left">{product?.label}</TableCell>
                                <TableCell align="left">{`$${product?.price ? product?.price * order.number : undefined} `}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider textAlign="center">Payments</Divider>
            <div>
                {transactionSet.payment_set?.map((payment, index) => <div key={index}>{`${payment.index_key}`}</div>)}
            </div>
            <Divider textAlign="center">Refunds</Divider>
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