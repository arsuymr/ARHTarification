// ParametersComponent.jsx
import React from 'react';
import { Box, Slider, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';

export default function ParametersComponent({ params, setParams }) {
    const handleParamChange = (index, value) => {
        const newParams = [...params];
        newParams[index] = value;
        setParams(newParams);
    };

    return (
        <Box sx={{ padding: 2, width: '100%', mb: "0px" }}>
            {params && params.map((param, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '1000px' }}>
                            <Typography gutterBottom>Parameter {index + 1}: A very long parameter name that might overflow</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Slider
                                value={param}
                                onChange={(event, newValue) => handleParamChange(index, newValue)}
                                aria-labelledby={`continuous-slider-${index}`}
                                min={0}
                                max={10}
                                step={0.1}
                            />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}

ParametersComponent.propTypes = {
    params: PropTypes.array.isRequired,
    setParams: PropTypes.func.isRequired,
};
