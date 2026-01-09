import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

const Prompt = ({ onSubmit }) => {
    const [query, setQuery] = useState('');

    return (
        <Box 
            borderStyle="round" 
            borderColor="#585b70" 
            paddingX={1} 
            marginTop={1}
            width="80%"
            alignSelf="center"
        >
            <Text color="#b4befe">What happens next? <Text color="#585b70">❧</Text> </Text>
            <TextInput 
                value={query}
                onChange={setQuery}
                onSubmit={(val) => {
                    onSubmit(val);
                    setQuery('');
                }}
            />
        </Box>
    );
};

export default Prompt;
