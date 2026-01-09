import React from 'react';
import { Save, Sparkles } from 'lucide-react';

const Editor = ({ activeFile, content, handleContentChange, isSaving }) => {
    return (
        <div className="flex-1 flex flex-col items-center bg-background min-h-screen relative overflow-y-auto">
            {/* Top Bar for Meta (Medium style: "Draft in My Novel") */}
            <div className="w-full max-w-[740px] pt-8 pb-4 flex items-center justify-between text-xs text-secondary px-8 md:px-0">
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-serif text-[10px]">
                        {activeFile ? 'M' : 'N'}
                    </div>
                    <span>
                        {activeFile ? `Draft in ${activeFile.split('/').slice(-2, -1)[0]}` : 'New Story'}
                    </span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className={isSaving ? 'text-accent animate-pulse' : 'opacity-50'}>
                        {isSaving ? 'Saving...' : 'Saved'}
                    </span>
                 </div>
            </div>

            {/* Main Canvas */}
            <div className="w-full max-w-[740px] px-8 md:px-0 pb-32">
                 {activeFile ? (
                    <div className="animate-fade-in group">
                        {/* Title Input area could live here if parsed separately, 
                            but for markdown file editing we treat the first H1 as title 
                            or just raw content. For now: raw content. 
                        */}
                        <textarea
                            value={content}
                            onChange={handleContentChange}
                            className="w-full min-h-[calc(100vh-200px)] bg-transparent text-primary font-serif text-xl leading-[1.8] focus:outline-none resize-none placeholder:text-white/20 selection:bg-accent-dim selection:text-white"
                            spellCheck="false"
                            placeholder="Title..." // User likely types first line as title
                            style={{ fontFamily: '"Merriweather", "Georgia", serif' }} 
                        />
                    </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center mt-32 opacity-20">
                        <Sparkles size={40} strokeWidth={1} className="mb-4" />
                        <p className="font-display text-2xl">Tell your story...</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default Editor;
