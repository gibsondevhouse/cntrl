import React, { useEffect, useRef } from 'react';
import { Sparkles, Send, Info } from 'lucide-react';

const Oracle = ({ isOpen, aiInput, setAiInput, aiResponse, isAiThinking, handleAiExecute }) => {
    const aiEndRef = useRef(null);
    
    useEffect(() => {
        aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiResponse]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 h-screen w-[380px] bg-background border-l border-white/5 z-40 p-6 flex flex-col animate-slide-in-right md:flex hidden">
            
            {/* Header: Context Label */}
            <div className="mb-6 flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent font-mono">Context // Oracle</span>
                <Info size={12} className="text-secondary opacity-50" />
            </div>

            {/* Response Stream Area */}
            <div className="flex-1 overflow-y-auto mb-6 scrollbar-hide">
                {aiResponse && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                             <Sparkles size={10} className="text-accent" />
                             <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest">The Oracle Speaks</span>
                        </div>
                        <div className="font-serif text-sm leading-relaxed text-primary/90 whitespace-pre-wrap">
                            {aiResponse}
                            {isAiThinking && <span className="inline-block w-1.5 h-4 ml-1 bg-accent animate-pulse align-middle" />}
                        </div>
                        <div ref={aiEndRef} />
                    </div>
                )}

                {isAiThinking && !aiResponse && (
                    <div className="flex flex-col gap-2 animate-pulse pl-1">
                        <div className="h-2 w-3/4 bg-white/10 rounded" />
                        <div className="h-2 w-1/2 bg-white/10 rounded" />
                        <div className="h-2 w-2/3 bg-white/10 rounded" />
                    </div>
                )}
                
                {!aiResponse && !isAiThinking && (
                     <div className="text-center mt-20 opacity-30">
                        <p className="text-xs font-serif italic">The oracle is listening...</p>
                     </div>
                )}
            </div>

            {/* Input Area (Bottom Fixed inside sidebar) */}
            <div className="relative">
                 <textarea 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiExecute(); } }}
                    placeholder="Inquire..."
                    className="w-full bg-white/5 border border-white/5 rounded-lg p-4 pb-10 text-sm focus:outline-none focus:border-white/10 transition-colors resize-none h-32"
                 />
                 <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-[9px] text-white/20 font-mono">GEMINI 1.5</span>
                    <button 
                        onClick={handleAiExecute}
                        disabled={!aiInput.trim() || isAiThinking}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-accent/20 hover:text-accent disabled:opacity-20 transition-all"
                    >
                        <Send size={12} />
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default Oracle;
