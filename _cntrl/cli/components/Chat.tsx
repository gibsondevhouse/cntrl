import React from 'react';
import { Box, Text } from 'ink';

interface Message {
    sender: string;
    text: string;
}

interface ChatProps {
    messages: Message[];
    streamingContent: string;
}

const Chat: React.FC<ChatProps> = ({ messages, streamingContent }) => {
    return (
        <Box flexDirection="column" flexGrow={1} overflow="hidden">
            {messages.map((msg, i) => (
                <Box key={i} flexDirection="column" marginBottom={1}>
                    <Text color={
                        msg.sender === 'AGENT' ? '#cba6f7' : 
                        msg.sender === 'SYSTEM' ? '#fab387' : '#cdd6f4'
                    } bold={msg.sender !== 'USER'}>
                        {msg.sender === 'AGENT' ? 'CNTRL' : (msg.sender === 'SYSTEM' ? 'SYSTEM' : 'YOU')}
                    </Text>
                    {/* TODO: Implement custom Markdown renderer for Ink 5+ compatibility */}
                    <Text color={msg.sender === 'SYSTEM' ? '#fab387' : msg.sender === 'AGENT' ? '#cba6f7' : "#a6adc8"} dimColor={msg.sender === 'USER'}>
                        {msg.text}
                    </Text>
                </Box>
            ))}
            {streamingContent && (
                <Box flexDirection="column" marginBottom={1}>
                    <Text color="#cba6f7" bold>CNTRL</Text>
                    <Text color="#cba6f7">{streamingContent}</Text>
                </Box>
            )}

            {messages.length === 0 && !streamingContent && (
                <Box marginLeft={2} marginTop={1}>
                    <Text color="#585b70" italic>The blank page awaits...</Text>
                </Box>
            )}
        </Box>
    );
};

export default Chat;
