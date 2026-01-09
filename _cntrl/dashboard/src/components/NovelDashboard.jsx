import React from 'react';
import { BookOpen, Users, Map, Activity, ChevronRight, PenTool, Lock } from 'lucide-react';

const NovelDashboard = ({ novelPath, novelName, onNavigate }) => {
    // In a real app, we'd fetch specific stats for this novel here.
    // For now, we mock the module data based on the "Enterprise OCD" structure.

    const modules = [
        {
            id: 'manuscript',
            title: 'Manuscript',
            subtitle: 'Draft Zero',
            icon: BookOpen,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20',
            stat: '12,403 words',
            subitems: ['01_Draft_Zero', '02_Draft_One', '03_Final_Polish']
        },
        {
            id: 'cast',
            title: 'Cast Register',
            subtitle: 'Protagonists & Supporting',
            icon: Users,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20',
            stat: '4 Characters',
            subitems: ['Main_Cast', 'Supporting_Cast']
        },
        {
            id: 'world',
            title: 'World Bible',
            subtitle: 'Locations & Lore',
            icon: Map,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/20',
            stat: '2 Locations',
            subitems: ['Locations', 'Timeline', 'Magic_System']
        },
        {
            id: 'plot',
            title: 'Plot Architecture',
            subtitle: 'Beats & Outline',
            icon: Activity,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
            border: 'border-rose-400/20',
            stat: '6 Beats',
            subitems: ['Act_1', 'Act_2', 'Act_3']
        }
    ];

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-background px-16 py-16 animate-fade-in">
             <div className="max-w-6xl mx-auto">
                 {/* Header */}
                 <header className="mb-16">
                     <h1 className="font-display text-5xl text-white mb-4">{novelName}</h1>
                     <div className="flex items-center gap-4 text-secondary font-mono text-xs uppercase tracking-widest">
                         <span>Novel Project</span>
                         <span className="text-white/20">•</span>
                         <span>Last Edited: Just now</span>
                     </div>
                 </header>

                 {/* Focus Action */}
                 <div className="mb-16">
                     <button 
                        onClick={() => onNavigate(novelPath + '/01_Manuscript/01_Draft_Zero')} // Mock navigation
                        className="group flex items-center gap-4 bg-surface hover:bg-surface-hover border border-white/5 rounded-xl p-1 pr-6 transition-all duration-300 hover:border-accent/30"
                     >
                         <div className="bg-accent text-background p-4 rounded-lg group-hover:scale-105 transition-transform">
                             <PenTool size={24} />
                         </div>
                         <div className="text-left">
                             <h3 className="text-white font-bold tracking-wide">Continue Draft Zero</h3>
                             <p className="text-secondary text-sm">Chapter 3: The Inciting Incident</p>
                         </div>
                         <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                             <ChevronRight size={20} />
                         </div>
                     </button>
                 </div>

                 {/* Modules Grid - LOCKED */}
                 <div className="relative">
                     {/* Overlay */}
                     <div className="absolute inset-0 z-20 backdrop-blur-sm bg-background/60 flex flex-col items-center justify-center border border-white/5 rounded-2xl">
                         <div className="bg-surface p-6 rounded-full mb-4 border border-white/10 shadow-2xl">
                             <Lock size={32} className="text-secondary/50" />
                         </div>
                         <h3 className="text-xl font-display text-primary mb-2">Coming Soon</h3>
                         <p className="text-sm font-mono text-secondary max-w-xs text-center">
                             The Novel Dashboard is currently under construction. 
                             <br/>Access your manuscript files directly from the sidebar.
                         </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 pointer-events-none filter blur-[2px]">
                         {modules.map((mod) => (
                             <div 
                                key={mod.id}
                                className={`group relative bg-surface border ${mod.border} rounded-xl p-8 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
                             >
                                 {/* Background Glow */}
                                 <div className={`absolute -right-10 -top-10 w-40 h-40 ${mod.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                 
                                 <div className="relative z-10">
                                     <div className="flex justify-between items-start mb-6">
                                         <div className={`p-3 rounded-lg ${mod.bg} ${mod.color}`}>
                                             <mod.icon size={24} />
                                         </div>
                                         <span className="font-mono text-xs text-secondary/60">{mod.stat}</span>
                                     </div>
                                     
                                     <h3 className="font-display text-2xl text-primary mb-1 group-hover:text-white transition-colors">{mod.title}</h3>
                                     <p className="text-secondary text-sm mb-8">{mod.subtitle}</p>
    
                                     {/* Sub-items (Visual Only) */}
                                     <div className="space-y-2">
                                         {mod.subitems.map(item => (
                                             <div key={item} className="flex items-center gap-2 text-xs text-secondary/40 font-mono">
                                                 <div className={`w-1 h-1 rounded-full ${mod.bg.replace('/10', '')}`} />
                                                 {item.replace(/_/g, ' ')}
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};

export default NovelDashboard;
