import React from 'react';
import { Plus, Clock, FileText, ArrowUpRight, Hash } from 'lucide-react';

const ArticlesDashboard = ({ onNavigate, onNewArticle }) => {
    // Mock Data for Articles
    const articles = [
        {
            id: 'art-1',
            title: "The Death of the Interface",
            excerpt: "Why we are moving towards invisible computing...",
            date: "2h ago",
            readTime: "5 min",
            tags: ["Design", "Future"],
            status: "Draft",
            wordCount: 1205
        },
        {
            id: 'art-2',
            title: "Notes on 'Dune'",
            excerpt: "Analyzing the ecological metaphors in Herbert's work...",
            date: "Yesterday",
            readTime: "12 min",
            tags: ["Literature", "Analysis"],
            status: "Polished",
            wordCount: 3400
        },
        {
            id: 'art-3',
            title: "Weekly Journal: Jan 8",
            excerpt: "Productivity systems and the failure of habits...",
            date: "Jan 8",
            readTime: "3 min",
            tags: ["Journal"],
            status: "Draft",
            wordCount: 450
        }
    ];

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-background px-12 py-12 animate-fade-in relative">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="font-display text-4xl text-primary mb-2">Articles & Essays</h1>
                        <p className="font-mono text-xs text-secondary/60 uppercase tracking-widest">
                            {articles.length} Drafts • Last Updated Today
                        </p>
                    </div>
                    
                    <button 
                        onClick={onNewArticle}
                        className="group flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg hover:bg-accent/90 transition-all font-medium text-sm"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        <span>New Draft</span>
                    </button>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {articles.map((article) => (
                        <div 
                            key={article.id}
                            className="break-inside-avoid group relative bg-surface hover:bg-surface-hover border border-white/5 hover:border-accent/20 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                            onClick={() => onNavigate && onNavigate(article.title)} // Mock navigation
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`
                                    px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase border
                                    ${article.status === 'Polished' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-secondary border-white/5 bg-white/5'}
                                `}>
                                    {article.status}
                                </div>
                                <ArrowUpRight size={14} className="text-secondary/20 group-hover:text-accent transition-colors" />
                            </div>

                            <h3 className="font-display text-xl text-primary mb-3 leading-tight group-hover:text-white transition-colors">
                                {article.title}
                            </h3>
                            
                            <p className="text-secondary text-sm mb-6 line-clamp-3 leading-relaxed">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-xs text-secondary/40 font-mono border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {article.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText size={12} />
                                        {article.wordCount}w
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                     {article.tags.map(tag => (
                                         <span key={tag} className="text-secondary/60">#{tag}</span>
                                     ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Quick Add Card */}
                    <div 
                        onClick={onNewArticle}
                        className="break-inside-avoid flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-xl text-secondary/40 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer min-h-[200px]"
                    >
                        <Plus size={24} className="mb-2" />
                        <span className="font-mono text-xs uppercase tracking-widest">Create New</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlesDashboard;
