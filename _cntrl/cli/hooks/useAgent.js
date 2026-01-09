import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const useAgent = () => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('IDLE'); // IDLE, THINKING, WRITING
    const [streamingContent, setStreamingContent] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
             // Optional: System message
        });

        socket.on('agent_state', (data) => {
            setStatus(data.state);
        });

        socket.on('agent_token', (data) => {
            setStreamingContent(prev => prev + data.token);
        });

        socket.on('message', (data) => {
            if (data.final) {
                // Determine if we should replace the streaming content or append a new message
                // For simplicity, we commit the streaming content as a message
                setMessages(prev => [...prev, { sender: 'AGENT', text: data.text }]);
                setStreamingContent('');
                setStatus('IDLE');
            } else {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => socket.disconnect();
    }, []);

    const sendCommand = useCallback((text) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { sender: 'USER', text }]);
        setStreamingContent(''); // Reset stream buffer
        setStatus('THINKING');
        socket.emit('command', { text });
    }, []);

    return {
        messages,
        status,
        streamingContent,
        sendCommand
    };
};

export default useAgent;
