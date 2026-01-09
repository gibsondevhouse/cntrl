import React from 'react';
import { Box, Text } from 'ink';

const Chat = ({ messages, streamingContent }) => {
    return (
        <Box flexDirection="column" marginTop={1}>
            {messages.map((msg, i) => (
                <Box key={i} flexDirection="column" marginBottom={1}>
                    <Text color={msg.sender === 'USER' ? '#a6e3a1' : '#b4befe'}>
                        {msg.sender === 'USER' ? '●' : '◆'} 
                        <Text color="#585b70" dimColor> {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</Text>
                    </Text>
                    <Box marginLeft={2}>
                        <Text color="#dcdfe4">{msg.text}</Text>
                    </Box>
                </Box>
            ))}
            
            {/* Streaming Buffer */}
            {streamingContent && (
                <Box flexDirection="column" marginBottom={1}>
                     <Text color="#b4befe">◆ <Text color="#585b70" dimColor>thinking...</Text></Text>
                     <Box marginLeft={2}>
                        <Text color="#dcdfe4" dimColor>{streamingContent} <Text color="#b4befe">█</Text></Text>
                     </Box>
                </Box>
            )}

            {messages.length === 0 && !streamingContent && (
                <Box marginLeft={2}>
                    <Text color="#585b70" italic>The blank page awaits...</Text>
                </Box>
            )}
        </Box>
    );
};

export default Chat;
