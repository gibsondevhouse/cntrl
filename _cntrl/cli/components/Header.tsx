import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

const Header = () => {
    return (
        <Box flexDirection="column" paddingBottom={1}>
            <Gradient colors={['#cba6f7', '#f5c2e7', '#cba6f7']}>
                <BigText text="CNTRL" font="block" align='left' />
            </Gradient>
            <Box marginTop={-1} marginLeft={1}>
                <Text color="#a6accd" dimColor>
                    THE STORYTELLER ENGINE v2.0 // <Text color="#cba6f7" bold>LUCID</Text>
                </Text>
            </Box>
            <Text color="#45475a">
                ────────────────────────────────────────────────────────────────────────
            </Text>
        </Box>
    );
};

export default Header;
