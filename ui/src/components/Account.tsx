import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from '@mui/material/Container';


import PendingOrders from './PendingOrders';
import PastOrders from './PastOrders';
import Payments from './Payments';
import Refunds from './Refunds';
import Balance from './Balance';


type Props = {
    userId: number | undefined;
}

export default function Account({userId}: Props) {
    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom>
                Account
            </Typography>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant="h4" component="h2" gutterBottom>Balance</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Balance userId={userId} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography variant="h4" component="h2" gutterBottom>Pending Orders</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <PendingOrders userId={userId} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography variant="h4" component="h2" gutterBottom>Order History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <PastOrders userId={userId} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography variant="h4" component="h2" gutterBottom>Payments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Payments userId={userId} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography variant="h4" component="h2" gutterBottom>Refunds</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Refunds userId={userId} />
                </AccordionDetails>
            </Accordion>
      </Container>
    );
}
