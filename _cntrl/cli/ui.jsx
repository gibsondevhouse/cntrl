import React from 'react';
import { Box } from 'ink';
import Header from './components/Header.jsx';
import Chat from './components/Chat.jsx';
import Prompt from './components/Prompt.jsx';
import Status from './components/Status.jsx';
import useAgent from './hooks/useAgent.js';

const UI = () => {
    const { messages, status, streamingContent, sendCommand } = useAgent();

    return (
        <Box flexDirection="column" height="100%">
            <Header />
            <Box flexGrow={1} flexDirection="column" paddingX={1}>
                <Chat messages={messages} streamingContent={streamingContent} />
            </Box>
            <Status mode={status} />
            <Prompt onSubmit={sendCommand} />
        </Box>
    );
};

export default UI;
