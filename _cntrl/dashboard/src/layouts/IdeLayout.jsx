import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import NavRail from '../components/NavRail';
import Library from '../components/Library';
import Editor from '../components/Editor';
import Oracle from '../components/Oracle';
import HomeFeed from '../components/HomeFeed';

import NovelDashboard from '../components/NovelDashboard';
import ArticlesDashboard from '../components/ArticlesDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const IdeLayout = ({ socket, status }) => {
  const [activeMode, setActiveMode] = useState('HOME'); 
  const [fileList, setFileList] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Drawer States
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false); 

  // AI State
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // --- Data Fetching ---
  const refreshFiles = useCallback(() => {
    fetch(`${API_URL}/api/files/list`)
        .then(res => res.json())
        .then(data => setFileList(data.files))
        .catch(err => console.error("Failed to load files:", err));
  }, []);

  useEffect(() => {
    refreshFiles();
    
    if (socket) {
        socket.on('FILE_CHANGED', refreshFiles);
        socket.on('agent_token', (data) => {
            setAiResponse(prev => prev + data.token);
            setIsAiThinking(false);
            setIsOracleOpen(true);
        });
        socket.on('agent_state', (data) => {
            setIsAiThinking(data.state === 'THINKING' || data.state === 'WRITING');
        });
        socket.on('message', () => {
             // Handle generic messages if needed
        });
    }

    return () => {
        if (socket) {
            socket.off('FILE_CHANGED');
            socket.off('agent_token');
            socket.off('agent_state');
            socket.off('message');
        }
    };
  }, [socket, refreshFiles]);

  // --- Auto Save ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (target, val) => {
        if (!target) return;
        setIsSaving(true);
        try {
            await fetch(`${API_URL}/api/files/write`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ target, content: val })
            });
            setTimeout(() => setIsSaving(false), 800);
        } catch (err) {
            console.error("Auto-save Error:", err);
            setIsSaving(false);
        }
    }, 2000),
    []
  );

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    debouncedSave(activeFile, val);
  };

  // --- File Selection ---
  const handleFileSelect = async (filename, isDir = false) => {
    setActiveFile(filename);

    if (isDir) {
        // Assume it's a novel folder for now if selected from top level
        setActiveMode('NOVEL');
        setIsLibraryOpen(false);
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/files/read`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ target: filename })
        });
        const data = await res.json();
        setContent(data.content);
        setIsLibraryOpen(false); // Auto-close drawer on select
        setActiveMode('EDIT'); // Switch to write mode
    } catch (err) {
        console.error("Read Error:", err);
    }
  };

  // --- AI Execution ---
  const handleAiExecute = () => {
    if (!aiInput.trim() || !socket) return;
    setAiResponse('');
    setIsAiThinking(true);
    
    const contextPrompt = activeFile 
        ? `[BUFFER: ${activeFile}]\n${content}\n\n[USER INQUIRY]\n${aiInput}`
        : aiInput;

    socket.emit('command', { text: contextPrompt });
    setAiInput('');
  };

  // --- Layout Logic ---
  const handleNavModeChange = (mode) => {
      if (mode === 'READ') {
          setIsLibraryOpen(!isLibraryOpen);
          if (isOracleOpen) setIsOracleOpen(false); 
      } else if (mode === 'ORACLE') {
          setIsOracleOpen(!isOracleOpen);
          if (isLibraryOpen) setIsLibraryOpen(false);
      } else {
          setActiveMode(mode);
          setIsLibraryOpen(false);
          setIsOracleOpen(false);
      }
  };

  const getMainContent = () => {
      if (activeMode === 'HOME') return <HomeFeed fileList={fileList} onFileSelect={handleFileSelect} />;
      if (activeMode === 'NOVEL') return <NovelDashboard novelPath={activeFile} novelName={activeFile ? activeFile.split('/').pop() : 'Novel'} onNavigate={handleFileSelect} />;
      if (activeMode === 'ARTICLES') return <ArticlesDashboard onNavigate={handleFileSelect} onNewArticle={() => console.log('New Article')} />;
      return (
             <Editor 
                activeFile={activeFile} 
                content={content} 
                handleContentChange={handleContentChange} 
                isSaving={isSaving} 
             />
      );
  };

  return (
    <div className="flex bg-background min-h-screen font-sans selection:bg-accent-dim selection:text-white overflow-hidden">
      
      {/* 1. Nav Rail (Fixed Left) */}
      <NavRail activeMode={isLibraryOpen ? 'READ' : (isOracleOpen ? 'ORACLE' : activeMode)} setActiveMode={handleNavModeChange} />

      {/* 2. Library Drawer (Slide-out) */}
      <Library 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        fileList={fileList} 
        onFileSelect={handleFileSelect}
        activeFile={activeFile}
        onCategorySelect={(category) => {
             if (category === 'ARTICLES') setActiveMode('ARTICLES');
             if (category === 'NOVELS') setActiveMode('HOME'); // Revert to Home/Novel list
        }}
      />

      {/* 3. Main Content Area */}
      <div className={`
        flex-1 ml-[72px] transition-all duration-300 ease-in-out h-screen overflow-y-auto bg-background
        ${isOracleOpen ? 'mr-[380px]' : ''} 
      `}>
          {getMainContent()}
      </div>

      {/* 4. Oracle (Fixed/Toggle Right) */}
      <Oracle 
        isOpen={isOracleOpen}
        aiInput={aiInput}
        setAiInput={setAiInput}
        aiResponse={aiResponse}
        isAiThinking={isAiThinking}
        handleAiExecute={handleAiExecute}
      />

    </div>
  );
};

export default IdeLayout;
