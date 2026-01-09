import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import IdeLayout from './layouts/IdeLayout';

// Connect to the Gibby Core backend
const socket = io('http://localhost:3001');

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
    <IdeLayout>
      {/* Content is currently handled within IdeLayout for the V1 Stub */}
    </IdeLayout>
  );
}

export default App;
