import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';

const Header = () => (
    <Box flexDirection="column" marginBottom={1} paddingX={1}>
        <Text color="#b4befe">
            <BigText text="cntrl" font="simple" />
        </Text>
        <Box marginTop={-1}>
            <Text color="#585b70">──────────────────────────────────────</Text>
        </Box>
        <Box justifyContent="space-between" width={40}>
            <Text color="#585b70" dimColor>the storyteller engine · vol. ii</Text>
            <Text color="#a6e3a1">● lucid</Text>
        </Box>
    </Box>
);

export default Header;
