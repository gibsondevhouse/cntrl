import React from 'react';
import { Box } from 'ink';
import Header from './components/Header.js';
import Chat from './components/Chat.js';
import Prompt from './components/Prompt.js';
import Status from './components/Status.js';
import useAgent from './hooks/useAgent.js';

const UI = () => {
    const { messages, status, streamingContent, sendCommand } = useAgent();

    return (
        <Box flexDirection="column" height="100%" paddingX={2} paddingY={1}>
            <Header />
            <Box flexGrow={1} flexDirection="column" paddingY={1}>
                <Chat messages={messages} streamingContent={streamingContent} />
            </Box>
            <Status mode={status} />
            <Prompt onSubmit={sendCommand} />
        </Box>
    );
};

export default UI;
