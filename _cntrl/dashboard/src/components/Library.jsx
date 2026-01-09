import React, { useState } from 'react';
import { Book, FileText, PenTool, Search, Folder, ChevronRight, Briefcase, Coffee } from 'lucide-react';

const Library = ({ isOpen, onClose, fileList, onFileSelect, activeFile, onCategorySelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('NOVELS'); // NOVELS | ARTICLES | JOURNALS
    const [expandedFolders, setExpandedFolders] = useState({});

    if (!isOpen) return null;

    const toggleFolder = (path) => {
        setExpandedFolders(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    // --- Strict Filtering Logic ---
    const getFilteredNodes = () => {
        const lowerSearch = searchTerm.toLowerCase();

        // Helper: Is this a system file/folder?
        const isSystem = (name) => name.startsWith('.') || name === '_template' || name === 'node_modules';
        
        // Helper: Does this match current category?
        const isArticleFolder = (name) => name === 'Articles';
        const isJournalFolder = (name) => name === 'Journals';

        // 1. First pass: Filter top-level items based on Category
        let topLevel = fileList.filter(node => {
            if (isSystem(node.name)) return false;

            if (activeCategory === 'NOVELS') {
                // Novels = folders that are NOT Articles or Journals
                // Also exclude loose files? Usually novels are folders. 
                // Let's show folders that aren't excluded.
                return !isArticleFolder(node.name) && !isJournalFolder(node.name);
            }
            if (activeCategory === 'ARTICLES') return isArticleFolder(node.name);
            if (activeCategory === 'JOURNALS') return isJournalFolder(node.name);
            return false;
        });

        // 2. If Articles/Journals, we probably want to show their CHILDREN, not the folder itself.
        // If the user clicks "Articles", they want to see the articles, not click "Articles" folder again.
        if ((activeCategory === 'ARTICLES' || activeCategory === 'JOURNALS') && topLevel.length > 0) {
            const targetFolder = topLevel[0];
            return targetFolder.children || [];
        }

        // 3. Search Filter (Recursive not fully implemented, simple name match for now)
        if (searchTerm) {
             return topLevel.filter(n => n.name.toLowerCase().includes(lowerSearch));
        }

        return topLevel;
    };

    const displayNodes = getFilteredNodes();

    // --- Recursive Tree Renderer ---
    const renderTree = (nodes, depth = 0) => {
        if (!nodes) return null;
        
        return nodes.map(node => {
             if (node.name.startsWith('.')) return null; 

             const isDir = node.isDir || node.isDirectory || node.children;
             const isExpanded = expandedFolders[node.path];
             const isActive = activeFile === node.path;

             return (
                <div key={node.path} className="animate-fade-in">
                    <div 
                        className={`
                            group flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-all duration-200 select-none
                            ${isActive ? 'bg-accent/10 text-accent' : 'text-secondary hover:text-primary hover:bg-white/5'}
                        `}
                        style={{ paddingLeft: `${depth * 12 + 12}px` }}
                        onClick={() => {
                            if (isDir) {
                                // NEW: If top level, it's a novel. Fire select event to open Dashboard.
                                if (depth === 0 && activeCategory === 'NOVELS') {
                                    onFileSelect(node.path, true); // true = isDir
                                } 
                                // Also toggle for viewing children if user wants that? 
                                // Actually, Medium style usually separates viewing structure from writing.
                                // Let's simplify: Clicking a novel header opens Dashboard.
                                // But we also need to see inside.
                                // Compromise: Click text -> Dashboard. Chevron -> Expand.
                            } else {
                                onFileSelect(node.path);
                            }
                        }}
                    >
                         {/* Icon Logic */}
                         <div 
                            className={`
                                ${isActive ? 'text-accent' : 'text-secondary/50 group-hover:text-secondary'} 
                                transition-colors p-1
                            `}
                            onClick={(e) => {
                                if (isDir) {
                                    e.stopPropagation();
                                    toggleFolder(node.path);
                                }
                            }}
                         >
                             {isDir ? (
                                 <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                             ) : (
                                 <div className="w-3.5 h-[1px] bg-current opacity-50" />
                             )}
                         </div>

                         <span className="truncate flex-1 text-sm font-medium tracking-wide">
                            {node.name.replace('.md', '')}
                         </span>
                    </div>

                    {/* Children */}
                    {isDir && isExpanded && node.children && (
                        <div className="border-l border-white/5 ml-[calc(12px_+_7px)]">
                            {renderTree(node.children, depth + 1)}
                        </div>
                    )}
                </div>
             );
        });
    };

    return (
        <div className={`
            fixed top-0 left-[72px] h-screen w-[300px] bg-background border-r border-white/5 
            transform transition-transform duration-300 ease-out z-40 flex flex-col
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Header Area */}
            <div className="p-6 pb-2">
                 <h2 className="text-[10px] font-bold tracking-[0.2em] text-accent/60 uppercase mb-4">Library</h2>

                 {/* Custom Segmented Control */}
                 <div className="flex bg-surface p-1 rounded-lg mb-6 border border-white/5">
                     <button
                        onClick={() => { setActiveCategory('NOVELS'); if(onCategorySelect) onCategorySelect('NOVELS'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeCategory === 'NOVELS' ? 'bg-white/5 text-white shadow-sm' : 'text-secondary hover:text-white/60'}`}
                     >
                         <Book size={12} />
                         <span className="text-secondary text-[10px] font-bold tracking-wider">NOVELS</span>
                     </button>
                     <button
                        onClick={() => { setActiveCategory('ARTICLES'); if(onCategorySelect) onCategorySelect('ARTICLES'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeCategory === 'ARTICLES' ? 'bg-white/5 text-white shadow-sm' : 'text-secondary hover:text-white/60'}`}
                     >
                         <Briefcase size={12} />
                         <span className="text-secondary text-[10px] font-bold tracking-wider">ARTICLES</span>
                     </button>
                     <button
                        onClick={() => { setActiveCategory('JOURNALS'); if(onCategorySelect) onCategorySelect('JOURNALS'); }}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeCategory === 'JOURNALS' ? 'bg-white/5 text-white shadow-sm' : 'text-secondary hover:text-white/60'}`}
                     >
                         <Coffee size={12} />
                         <span className="text-secondary text-[10px] font-bold tracking-wider">JOURNALS</span>
                     </button>
                 </div>

                 {/* Search */}
                 <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-secondary group-focus-within:text-accent transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeCategory.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-primary focus:outline-none focus:border-accent/20 transition-all font-mono placeholder:text-secondary/50"
                    />
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 mt-2">
                {displayNodes.length > 0 ? (
                    renderTree(displayNodes)
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-40">
                        <Folder size={24} className="text-secondary mb-2" />
                        <p className="text-xs text-secondary font-mono">
                            {searchTerm ? 'No matches found.' : 'Empty collection'}
                        </p>
                         {activeCategory !== 'NOVELS' && !searchTerm && (
                             <p className="text-[10px] text-secondary/60 mt-1">Coming Soon</p>
                         )}
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-surface/30">
                 <div className="flex justify-between items-center text-[10px] text-secondary/50 font-mono">
                     <span>{displayNodes.length} Items</span>
                     <span>Synced</span>
                 </div>
            </div>
        </div>
    );
};

export default Library;
