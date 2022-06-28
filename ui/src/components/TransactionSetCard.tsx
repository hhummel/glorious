import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import TransactionSetModal from './TransactionSetModal';
import { TransactionSet, Order, Payment, Product, Refund} from '../../types';

type Props = {
    transactionSet: TransactionSet;
    productData: Array<Product>;
}


export default function TransactionSetCard({transactionSet, productData}: Props) {
    return (
    <Card sx={{ px: 0 }} >
        <CardMedia
            component="img"
            height="130"
            image={transactionSet.order_set[0].product.picture || "https://gloriousgrain.s3.amazonaws.com/PXL_20210519_125730680.jpg"}
            alt={transactionSet.order_set[0].product.label || "Order basket"}
        />
        <CardContent sx={{ px: 0 }} >
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {`Order Date: ${new Date(transactionSet.date).toDateString()} ID: ${transactionSet.index_key}`}
            </Typography>

            <Divider><Chip label="Orders" /></Divider>
                <Table sx={{ minWidth: 150 }} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Del. Date</TableCell>
                        <TableCell align="left">{`\u2116`}</TableCell>
                        <TableCell align="left">Product</TableCell>
                        <TableCell align="left">Cost</TableCell>
                        <TableCell align="left">Status</TableCell>
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
                                <TableCell align="left">{new Date(order.delivery_date).toDateString().slice(0, -5)}</TableCell>
                                <TableCell align="left">{order.number}</TableCell>
                                <TableCell align="left">{product?.label}</TableCell>
                                <TableCell align="left">{`$${product?.price ? product?.price * order.number : undefined} `}</TableCell>
                                <TableCell align="left">{order.delivered ? <CheckCircleOutlineIcon/> : order.confirmed ? <RotateRightIcon/>  : <HighlightOffIcon/>}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            {transactionSet.payment_set.length > 0 && <Divider><Chip label="Payments" /></Divider>}
            {transactionSet.payment_set.length > 0 && <Table sx={{ minWidth: 150 }} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Pay Date</TableCell>
                        <TableCell align="left">Amount</TableCell>
                        <TableCell align="left">Method</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionSet.payment_set.map((payment, index) => {
                            return (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{new Date(payment.date).toDateString().slice(0, -5)}</TableCell>
                                <TableCell align="left">{payment.value}</TableCell>
                                <TableCell align="left">{payment.payment_method}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>}
            {transactionSet.refund_set.length > 0 && <Divider><Chip label="Refunds" /></Divider>}
            {transactionSet.refund_set.length > 0 && <Table sx={{ minWidth: 150 }} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Ref. Date</TableCell>
                        <TableCell align="left">Amount</TableCell>
                        <TableCell align="left">Method</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionSet.refund_set.map((refund, index) => {
                            return (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{new Date(refund.date).toDateString().slice(0, -5)}</TableCell>
                                <TableCell align="left">{refund.value}</TableCell>
                                <TableCell align="left">{refund.payment_method || '--'}</TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>}
        </CardContent>
        <CardActions>
            <TransactionSetModal transactionSet={transactionSet} productData={productData} />
        </CardActions>
    </Card>
    )
}