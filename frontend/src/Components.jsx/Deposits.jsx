// Deposits.jsx
import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

function preventDefault(event) {
    event.preventDefault();
}

function Title(props) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    );
}

Title.propTypes = {
    children: PropTypes.node,
};

export default function Deposits({ creu }) {
    return (
        <Box sx={{ padding: 2, width: '100%' }}>
            <Title>Current Creu Value</Title>
            <Typography component="p" variant="h4">
                {creu}
            </Typography>
            <Typography color="text.secondary" sx={{ marginTop: 1 }}>
                Updated in real-time
            </Typography>
            <Box sx={{ marginTop: 2 }}>
                <Link color="primary" href="#" onClick={preventDefault}>
                    View details
                </Link>
            </Box>
        </Box>
    );
}

Deposits.propTypes = {
    creu: PropTypes.number.isRequired,
};
