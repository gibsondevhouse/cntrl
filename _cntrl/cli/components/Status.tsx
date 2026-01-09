import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import open from 'open';
import { CONFIG } from '../../src/config/index.js';

interface StatusProps {
    mode: 'IDLE' | 'THINKING' | 'WRITING';
}

const Status: React.FC<StatusProps> = ({ mode }) => {
    const [status, setStatus] = useState<string>('');
    const [launched, setLaunched] = useState(false);

    useInput((input, key) => {
        if (input === '\x0c' || (key.ctrl && input === 'l')) { // Ctrl+L
            if (!launched) {
                setLaunched(true);
                setStatus('Launching Dashboard...');
                open(`http://localhost:${CONFIG.PORT || 3001}`);
                setTimeout(() => {
                    setStatus('');
                    setLaunched(false);
                }, 3000);
            }
        }
    });

    if (mode !== 'IDLE') {
        // When AI is active, show that instead of launch button
        const color = '#cba6f7';
        const label = mode === 'THINKING' ? 'Reflecting...' : 'Drafting...';
        return (
            <Box paddingX={1} paddingTop={0}>
                <Text color={color}>◎ {label}</Text>
            </Box>
        );
    }

    // Default Idle State -> Launch Button
    return (
        <Box paddingX={1} paddingTop={0}>
             <Text color={status ? '#a6e3a1' : '#45475a'}>
                {status ? `✓ ${status}` : `[ ^L LAUNCH APP ]`}
             </Text>
        </Box>
    );
};

export default Status;
