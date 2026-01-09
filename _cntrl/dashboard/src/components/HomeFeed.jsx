import React, { useEffect, useState } from 'react';
import { Clock, FileText, Sparkles, ChevronRight, MoreHorizontal } from 'lucide-react';

const HomeFeed = ({ fileList, onFileSelect }) => {
    const [greeting, setGreeting] = useState('Welcome');
    const [recentFiles, setRecentFiles] = useState([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Mock "Recent" logic: flattened list of first 3 markdown files
        // In a real app, backend would serve exact recent list.
        const flat = [];
        const traverse = (files) => {
            files.forEach(f => {
                if (!f.isDirectory && f.name.endsWith('.md')) flat.push(f);
                if (f.children) traverse(f.children);
            });
        };
        traverse(fileList);
        setRecentFiles(flat.slice(0, 4)); 
    }, [fileList]);

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-background px-12 py-16 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                
                {/* Hero Section */}
                <header className="mb-20">
                    <h1 className="font-display text-4xl text-white mb-2 tracking-tight">{greeting}, Author.</h1>
                    <p className="text-secondary text-lg font-serif italic">Ready to continue your story?</p>
                </header>

                {/* Section: Jump Back In */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Jump Back In</h2>
                        <button className="text-xs text-accent hover:text-white transition-colors">View All Library</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recentFiles.length > 0 ? recentFiles.map((file) => (
                            <div 
                                key={file.path}
                                onClick={() => onFileSelect(file.path)}
                                className="group relative bg-surface hover:bg-surface-hover border border-white/5 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/10"
                            >
                                <div className="flex justify-between items-start mb-4">
                                     <div className="p-3 bg-white/5 rounded-full text-secondary group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                     </div>
                                     <button className="text-white/20 hover:text-white transition-colors">
                                        <MoreHorizontal size={16} />
                                     </button>
                                </div>
                                <h3 className="font-display text-xl text-primary mb-2 group-hover:text-white transition-colors">
                                    {file.name.replace('.md', '').replace(/_/g, ' ')}
                                </h3>
                                <p className="text-xs font-mono text-secondary/60 truncate mb-6">
                                    {file.path.split('/').slice(-3, -1).join(' / ')}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Continue Writing</span>
                                    <ChevronRight size={10} />
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 py-12 text-center border border-dashed border-white/10 rounded-xl">
                                <p className="text-secondary text-sm">No recent drafts found.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section: Inspiration / Oracle */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">Daily Inspiration</h2>
                    </div>
                    
                    <div className="bg-gradient-to-br from-surface to-background border border-accent/10 rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-80" />
                        
                        <div className="relative z-10 flex gap-6 items-start">
                             <div className="p-4 bg-accent/10 rounded-full text-accent shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                <Sparkles size={24} />
                             </div>
                             <div>
                                <h3 className="font-display text-2xl text-white mb-3">The Oracle's Prompt</h3>
                                <p className="font-serif text-lg text-secondary leading-relaxed mb-6 max-w-2xl">
                                    "Describe a silence that is louder than any noise. Focus on the tension in the room, the unspoken words, and the physical weight of the atmosphere."
                                </p>
                                <button className="px-6 py-2 bg-white/5 hover:bg-accent/10 hover:text-accent border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase transition-all">
                                    Start Exploring
                                </button>
                             </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeFeed;
