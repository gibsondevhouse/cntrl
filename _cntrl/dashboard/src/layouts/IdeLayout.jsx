import React, { useState, useEffect } from 'react';
import { Files, Settings, Info, BookOpen, Edit3, Folder, FileText, ChevronRight, Save, Command } from 'lucide-react';

const IdeLayout = () => {
  const [activeMode, setActiveMode] = useState('EDIT'); // EDIT | READ
  const [fileList, setFileList] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch file tree on load (Roots)
  useEffect(() => {
    fetch('http://localhost:3001/api/files/list')
        .then(res => res.json())
        .then(data => setFileList(data.files))
        .catch(err => console.error("Failed to load files:", err));
  }, []);

  // Recursive Tree Component
  const FileTreeItem = ({ file, depth = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const isActive = activeFile === file.path;

    const handleToggle = async (e) => {
        e.stopPropagation();
        if (!file.isDirectory) {
            handleFileSelect(file.path);
            return;
        }

        setExpanded(!expanded);
        
        if (!loaded && !expanded) { // Load on first expand
            try {
                const res = await fetch(`http://localhost:3001/api/files/list?path=${encodeURIComponent(file.path)}`);
                const data = await res.json();
                setChildren(data.files);
                setLoaded(true);
            } catch (err) {
                console.error("Failed to load subfolder:", err);
            }
        }
    };

    return (
        <div className="select-none font-sans">
            <div 
                className={`
                    group flex items-center gap-2 px-3 py-1.5 my-0.5 text-xs tracking-wide cursor-pointer rounded-md transition-all duration-200
                    ${isActive 
                        ? 'bg-surface-hover text-primary shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5' 
                        : 'text-secondary hover:text-primary hover:bg-surface-hover/50 hover:pl-4'}
                `}
                style={{ paddingLeft: `${depth * 16 + 12}px` }}
                onClick={handleToggle}
            >
                {file.isDirectory ? (
                    <ChevronRight 
                        size={12} 
                        className={`transition-transform duration-300 opacity-60 ${expanded ? 'rotate-90' : ''} ${isActive ? 'text-accent' : ''}`} 
                    />
                ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent shadow-[0_0_8px_#D4AF37]' : 'bg-white/10 group-hover:bg-white/30'}`} />
                )}
                
                <span className={`${file.isDirectory ? 'font-medium opacity-90' : 'font-normal opacity-80'} ${isActive ? 'text-white' : ''}`}>
                    {file.name}
                </span>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children.map(child => (
                    <FileTreeItem key={child.path} file={child} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
  };

  // Load file content when selected
  const handleFileSelect = async (filename) => {
    setActiveFile(filename);
    try {
        const res = await fetch('http://localhost:3001/api/files/read', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ target: filename })
        });
        const data = await res.json();
        setContent(data.content);
    } catch (err) {
        console.error("Read Error:", err);
    }
  };

  // Save content
  const handleSave = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    try {
        await fetch('http://localhost:3001/api/files/write', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ target: activeFile, content })
        });
        setTimeout(() => setIsSaving(false), 800);
    } catch (err) {
        console.error("Save Error:", err);
        setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background text-secondary overflow-hidden font-sans selection:bg-accent-dim selection:text-white">
      
      {/* 1. Left Sidebar: Project Explorer */}
      <aside className="w-72 flex flex-col pt-3 pb-4 bg-surface-glass backdrop-blur-2xl border-r border-glass-border">
        <div className="h-10 flex items-center px-5 mb-4 opacity-50">
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-mono">CNTRL // NAV</span>
        </div>
        <div className="flex-1 px-2 overflow-y-auto scrollbar-hide mask-fade-bottom">
            {fileList.length > 0 ? (
                fileList.map((file) => <FileTreeItem key={file.path} file={file} />)
            ) : (
                <div className="px-6 py-4 text-xs italic opacity-30">Loading filesystem...</div>
            )}
        </div>
      </aside>

      {/* 2. Center Pane: Editor Canvas */}
      <main className="flex-1 flex flex-col relative bg-[#080808]">
        
        {/* Floating Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
             <div className="glass-panel px-1.5 py-1.5 rounded-full flex items-center gap-1 shadow-2xl ring-1 ring-white/5 transition-all hover:ring-white/10 hover:shadow-accent/5">
                 <button 
                    onClick={() => setActiveMode('EDIT')}
                    className={`
                        px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 flex items-center gap-2
                        ${activeMode === 'EDIT' ? 'bg-white text-black shadow-lg scale-105' : 'text-secondary hover:text-white hover:bg-white/5'}
                    `}
                 >
                    <Edit3 size={11} /> EDIT
                 </button>
                 <div className="w-px h-4 bg-white/10 mx-1"></div>
                 <button 
                    onClick={() => setActiveMode('READ')}
                    className={`
                        px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 flex items-center gap-2
                        ${activeMode === 'READ' ? 'bg-paper text-ink shadow-[0_0_20px_rgba(232,230,227,0.3)] scale-105' : 'text-secondary hover:text-white hover:bg-white/5'}
                    `}
                 >
                    <BookOpen size={11} /> READ
                 </button>
             </div>
        </div>

        {/* Status Bar / Breadcrumbs */}
        <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
            <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                {activeFile ? activeFile.split('/').pop() : 'NO BUFFER'}
            </span>
            <div className="pointer-events-auto">
                 <button 
                    onClick={handleSave} 
                    className={`
                        glass-button flex items-center gap-2
                        ${isSaving ? 'text-accent border-accent/20 bg-accent/10' : 'text-secondary'}
                    `}
                 >
                    <Save size={12} className={isSaving ? 'animate-pulse' : ''} />
                    {isSaving ? 'SAVING...' : 'SAVE'}
                 </button>
            </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto w-full transition-colors duration-700 ease-in-out ${activeMode === 'READ' ? 'bg-[#050505]' : 'bg-[#080808]'}`}>
            <div className={`
                mx-auto transition-all duration-700 ease-out min-h-[calc(100vh-4rem)]
                ${activeMode === 'READ' 
                    ? 'max-w-xl my-16 p-12 bg-paper text-ink shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm' 
                    : 'max-w-4xl py-24 px-12'}
            `}>
                {activeFile ? (
                     <div className="h-full animate-fade-in">
                        {activeMode === 'READ' ? (
                             <article className="prose prose-p:font-display prose-p:text-lg prose-p:leading-loose prose-headings:font-display text-justify">
                                <h1 className="font-display text-4xl mb-8 text-center border-b-2 border-ink/10 pb-6">
                                    {activeFile.split('/').pop().replace('.md', '').replace(/_/g, ' ')}
                                </h1>
                                <div className="font-display text-lg leading-[2.2em] indent-8 whitespace-pre-wrap">
                                    {content}
                                </div>
                                <div className="mt-16 flex justify-center text-ink/30">***</div>
                             </article>
                        ) : (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-[calc(100vh-12rem)] bg-transparent text-[#cccccc] font-mono text-sm leading-relaxed focus:outline-none resize-none placeholder:text-white/10"
                                spellCheck="false"
                                placeholder="Start typing..."
                            />
                        )}
                     </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-white/10 select-none">
                        <Command size={64} strokeWidth={1} className="mb-6 opacity-50" />
                        <p className="font-display text-2xl tracking-wide opacity-50">Select a manuscript</p>
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* 3. Right Sidebar: Context Inspector */}
      <aside className="w-[340px] flex flex-col bg-surface-glass backdrop-blur-2xl border-l border-glass-border">
        <div className="h-10 flex items-center justify-between px-5 mb-4 border-b border-white/5 bg-white/[0.02]">
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-mono">CONTEXT // META</span>
            <Info size={12} className="text-secondary opacity-50" />
        </div>
        
        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
            {/* Sister File Card */}
             {activeFile ? (
                <div className="glass-panel p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    </div>
                    <div className="mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-secondary font-mono block mb-1">Target Entity</span>
                        <h3 className="text-sm font-bold text-white font-sans break-all">{activeFile.split('/').pop()}</h3>
                    </div>
                    
                    <div className="space-y-3">
                         <div className="bg-black/40 rounded p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Status</span>
                            <div className="text-xs text-secondary font-mono">Draft / In Progress</div>
                         </div>
                         <div className="bg-black/40 rounded p-3 border border-white/5">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Word Count</span>
                            <div className="text-xs text-secondary font-mono">1,240 words</div>
                         </div>
                    </div>
                </div>
             ) : (
                <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <span className="text-secondary text-xs opacity-50">No context active</span>
                </div>
             )}

             {/* AI Input */}
             <div className="glass-panel p-1">
                <div className="bg-black/40 p-3 rounded-t-lg border-b border-white/5">
                    <h3 className="text-[10px] font-bold text-accent tracking-widest uppercase">Ask Cace</h3>
                </div>
                <div className="p-3">
                    <textarea 
                        className="cntrl-input w-full min-h-[100px] bg-transparent border-0 focus:ring-0 px-0 py-0 resize-none font-mono text-xs leading-relaxed"
                        placeholder="Critique the tone of this passage..."
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-white/20 font-mono">AI-MODEL: GEMINI 1.5 PRO</span>
                        <button className="glass-button text-[10px] px-3 py-1 bg-white/5 hover:bg-accent/10 hover:text-accent hover:border-accent/20">
                            EXECUTE
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </aside>

    </div>
  );
};

export default IdeLayout;
