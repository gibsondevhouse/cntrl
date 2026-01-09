import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface PromptProps {
    onSubmit: (value: string) => void;
}

const Prompt: React.FC<PromptProps> = ({ onSubmit }) => {
    const [query, setQuery] = useState('');

    return (
        <Box borderStyle="round" borderColor="magenta" paddingX={1} marginTop={1}>
            <Box marginRight={1}>
                <Text color="magenta">❧</Text>
            </Box>
            <TextInput 
                value={query}
                onChange={setQuery}
                onSubmit={(val) => {
                    onSubmit(val);
                    setQuery('');
                }}
                focus={true}
                placeholder="What happens next?"
            />
        </Box>
    );
};

export default Prompt;
