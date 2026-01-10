import React from 'react';
import { Plus, Clock, FileText, ArrowUpRight, Hash, Paperclip, AlertCircle, Layers } from 'lucide-react';

const ArticlesDashboard = ({ onNavigate, onNewArticle }) => {
    // Mock Data for Articles - Enhanced for "The Journalist"
    const articles = [
        {
            id: 'art-1',
            title: "The Death of the Interface",
            excerpt: "Why we are moving towards invisible computing. The distinct lack of screens in the future...",
            lastEdited: "2026-01-09T08:00:00", // Fresh
            deadline: "2026-01-12T00:00:00", // Urgent (3 days)
            outlet: "Wired",
            readTime: "5 min",
            tags: ["Design", "Future", "AI", "UX"],
            status: "Draft",
            wordCount: 1205,
            attachments: 3
        },
        {
            id: 'art-2',
            title: "Notes on 'Dune'",
            excerpt: "Analyzing the ecological metaphors in Herbert's work...",
            lastEdited: "2025-12-15T00:00:00", // Stale (> 2 weeks)
            outlet: "Personal Blog",
            series: "Sci-Fi Canon",
            readTime: "12 min",
            tags: ["Literature", "Analysis"],
            status: "Polished",
            wordCount: 3400,
            attachments: 12
        },
        {
            id: 'art-3',
            title: "Weekly Journal: Jan 8",
            excerpt: "Productivity systems and the failure of habits...",
            lastEdited: "2026-01-08T10:00:00",
            outlet: "Journal",
            readTime: "3 min",
            tags: ["Journal"],
            status: "Draft",
            wordCount: 450,
            attachments: 0
        }
    ];

    // Helper: Check for "Staleness" (> 14 days untouched)
    const isStale = (dateStr) => {
        const diff = new Date() - new Date(dateStr);
        return diff > (1000 * 60 * 60 * 24 * 14);
    };

    // Helper: Check for Urgency (< 3 days to deadline)
    const isUrgent = (deadlineStr) => {
        if (!deadlineStr) return false;
        const diff = new Date(deadlineStr) - new Date();
        return diff > 0 && diff < (1000 * 60 * 60 * 24 * 3);
    };

    // Helper: Format relative time simpler
    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-background px-12 py-12 animate-fade-in relative">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="font-display text-4xl text-primary mb-2">Articles & Essays</h1>
                        <p className="font-mono text-xs text-secondary/60 uppercase tracking-widest">
                            {articles.length} Drafts • {articles.filter(a => isUrgent(a.deadline)).length} Urgent
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
                    {articles.map((article) => {
                        const stale = isStale(article.lastEdited);
                        const urgent = isUrgent(article.deadline);

                        return (
                            <div 
                                key={article.id}
                                className={`
                                    break-inside-avoid group relative bg-surface hover:bg-surface-hover border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1
                                    ${stale ? 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : 'opacity-100'}
                                    ${urgent ? 'border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-accent/20'}
                                `}
                                onClick={() => onNavigate && onNavigate(article.title)} // Mock navigation
                            >
                                {/* Series Badge (Floating) */}
                                {article.series && (
                                    <div className="absolute -top-3 left-6 px-2 py-1 bg-surface border border-white/10 rounded-full text-[10px] font-mono text-accent flex items-center gap-1 shadow-sm uppercase tracking-wider z-10">
                                        <Layers size={10} />
                                        {article.series}
                                    </div>
                                )}

                                {/* Urgency Indicator */}
                                {urgent && (
                                    <div className="absolute top-4 right-4 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.4)]" />
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <div className="flex items-center gap-2">
                                         <div className={`
                                            px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase border
                                            ${article.status === 'Polished' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-secondary border-white/5 bg-white/5'}
                                        `}>
                                            {article.status}
                                        </div>
                                        {article.outlet && (
                                            <span className="text-[10px] font-mono text-secondary/60 uppercase tracking-wider">
                                                • {article.outlet}
                                            </span>
                                        )}
                                    </div>
                                    {!urgent && <ArrowUpRight size={14} className="text-secondary/20 group-hover:text-accent transition-colors" />}
                                </div>

                                <h3 className="font-display text-xl text-primary mb-3 leading-tight group-hover:text-white transition-colors">
                                    {article.title}
                                </h3>
                                
                                <p className="text-secondary text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-xs text-secondary/40 font-mono border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1" title="Last Edited">
                                            <Clock size={12} />
                                            {formatTime(article.lastEdited)}
                                        </span>
                                        <span className="flex items-center gap-1" title="Word Count">
                                            <FileText size={12} />
                                            {article.wordCount}w
                                        </span>
                                        {article.attachments > 0 && (
                                            <span className="flex items-center gap-1 text-accent/60" title="Attachments">
                                                <Paperclip size={12} />
                                                {article.attachments}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                         {article.tags.slice(0, 2).map(tag => (
                                             <span key={tag} className="text-secondary/60">#{tag}</span>
                                         ))}
                                         {article.tags.length > 2 && (
                                             <span className="text-secondary/30">+{article.tags.length - 2}</span>
                                         )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

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
