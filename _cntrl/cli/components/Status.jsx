import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const Status = ({ mode }) => {
    if (mode === 'IDLE') return null;

    return (
        <Box paddingX={1} marginBottom={1} alignSelf="center">
            <Text color="#a6e3a1">
                <Spinner type="dots" /> 
                {mode === 'THINKING' ? ' reasoning' : ' inscribing'}
            </Text>
        </Box>
    );
};

export default Status;
