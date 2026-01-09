import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
const socket: Socket = io(API_URL);

interface Message {
    sender: string;
    text: string;
    final?: boolean;
}

type AgentStatus = 'IDLE' | 'THINKING' | 'WRITING';

const useAgent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<AgentStatus>('IDLE');
    const [streamingContent, setStreamingContent] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
             // Optional: System message
        });

        socket.on('FILE_CHANGED', (data: { type: string, path: string }) => {
            setMessages(prev => [...prev, { 
                sender: 'SYSTEM', 
                text: `[EVENT] ${data.type}: ${data.path}` 
            }]);
        });

        socket.on('agent_state', (data: { state: AgentStatus }) => {
            setStatus(data.state);
        });

        socket.on('agent_token', (data: { token: string }) => {
            setStreamingContent(prev => prev + data.token);
        });

        socket.on('novels_list', (data: { novels: string[] }) => {
            const list = data.novels.length > 0 
                ? data.novels.map(n => ` ▪ ${n}`).join('\n')
                : "No novels found.";
            setMessages(prev => [...prev, { 
                sender: 'SYSTEM', 
                text: `Library Contents:\n${list}` 
            }]);
        });

        socket.on('message', (data: Message) => {
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

        return () => {
            socket.disconnect();
        };
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const sendCommand = useCallback((text: string) => {
        if (!text.trim()) return;

        // Intercept Slash Commands
        if (text.startsWith('/')) {
            const [cmd, ...args] = text.slice(1).split(' ');
            
            if (cmd === 'clear') {
                clearMessages();
                return;
            }
            
            if (cmd === 'help') {
                setMessages(prev => [...prev, { 
                    sender: 'SYSTEM', 
                    text: "Available: /clear, /help, /status, /list, /create, /open, /save, /quit\nFantasy Tools: /lore (add/read/list), /roll <query>, /stats" 
                }]);
                return;
            }

            // --- FANTASY TOOLS ---
            
            if (cmd === 'stats') {
                socket.emit('get_stats');
                return;
            }

            if (cmd === 'roll') {
                const query = args.join(' ');
                if (!query) {
                    setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /roll <what to generate>" }]);
                    return;
                }
                setStatus('THINKING');
                socket.emit('oracle_roll', { query });
                return;
            }

            if (cmd === 'lore') {
                const subCmd = args[0];
                const key = args[1]; // One word key for simplicity
                const content = args.slice(2).join(' ');

                if (subCmd === 'list') {
                    socket.emit('lore_list');
                    return;
                }
                
                if (subCmd === 'read') {
                    if (!key) {
                        setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /lore read <key>" }]);
                        return;
                    }
                    socket.emit('lore_get', { key });
                    return;
                }

                if (subCmd === 'add') {
                    if (!key || !content) {
                        setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /lore add <key> <content>" }]);
                        return;
                    }
                    socket.emit('lore_add', { key, content });
                    return;
                }

                setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /lore [add|read|list]" }]);
                return;
            }

            if (cmd === 'open') {
                const name = args.join(' ').replace(/"/g, '');
                if (!name) {
                    setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /open <Novel Name>" }]);
                    return;
                }
                socket.emit('open_novel', { name });
                return;
            }

            if (cmd === 'persona') {
                const tone = args.join(' ');
                if (!tone) {
                    setMessages(prev => [...prev, { sender: 'SYSTEM', text: "Usage: /persona <Tone Descriptor>" }]);
                    return;
                }
                socket.emit('update_persona', { tone });
                return;
            }

            if (cmd === 'save') {
                socket.emit('save_chat', { messages });
                return;
            }

            if (cmd === 'quit' || cmd === 'exit') {
                process.exit(0);
                return;
            }

            if (cmd === 'create') {
                const title = args[0]?.replace(/"/g, '');
                const summary = args.slice(1).join(' ').replace(/"/g, '');
                
                if (!title || !summary) {
                    setMessages(prev => [...prev, { 
                        sender: 'SYSTEM', 
                        text: "Usage: /create \"Novel Title\" \"A short premise\"" 
                    }]);
                    return;
                }

                socket.emit('create_novel', { title, summary });
                return;
            }

            if (cmd === 'list') {
                socket.emit('list_novels');
                return;
            }

            if (cmd === 'status') {
                 setMessages(prev => [...prev, { 
                    sender: 'SYSTEM', 
                    text: `System: CNTRL v2.0 | State: ${status} | Muse: Connected` 
                }]);
                return;
            }
        }

        setMessages(prev => [...prev, { sender: 'USER', text }]);
        setStreamingContent(''); // Reset stream buffer
        setStatus('THINKING');
        socket.emit('command', { text });
    }, [status, clearMessages]);

    return {
        messages,
        status,
        streamingContent,
        sendCommand,
        clearMessages
    };
};

export default useAgent;
