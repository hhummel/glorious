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
    return <Card>
        <CardMedia></CardMedia>
        <CardContent>
            <div>ID: {transactionSet.index_key}</div>
        </CardContent>
        <CardActions></CardActions>
    </Card>
}