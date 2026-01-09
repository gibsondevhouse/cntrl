import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import IdeLayout from './layouts/IdeLayout';

// Connect to the CNTRL Core backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(API_URL);

function App() {
  const [status, setStatus] = useState('OFFLINE');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('connect', () => setStatus('ONLINE'));
    socket.on('disconnect', () => setStatus('OFFLINE'));
    socket.on('message', (data) => {
      setLogs(prev => [...prev, `[${data.sender}]: ${data.text}`]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <IdeLayout socket={socket} status={status}>
      {/* Content is currently handled within IdeLayout for the V1 Stub */}
    </IdeLayout>
  );
}

export default App;
