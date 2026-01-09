import React from 'react';
import { Home, Book, Edit3, Sparkles, Settings, User } from 'lucide-react';

const NavRail = ({ activeMode, setActiveMode }) => {
    const navItems = [
        { id: 'HOME', icon: Home, label: 'Home' },
        { id: 'READ', icon: Book, label: 'Your Library' }, // Toggles Library Drawer
        { id: 'EDIT', icon: Edit3, label: 'Write' },
        { id: 'ORACLE', icon: Sparkles, label: 'Oracle' }, // Toggles Oracle
    ];

    return (
        <nav className="w-[72px] h-screen fixed left-0 top-0 flex flex-col items-center py-6 bg-surface border-r border-white/5 z-50">
            {/* Logo area */}
            <div className="mb-10 w-8 h-8 flex items-center justify-center">
                 <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full" />
                 </div>
            </div>

            {/* Main Actions */}
            <div className="flex-1 flex flex-col gap-8 w-full items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMode === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveMode(item.id)}
                            className={`
                                group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
                                ${isActive ? 'bg-white/10 text-white' : 'text-secondary hover:text-white hover:bg-white/5'}
                            `}
                            title={item.label}
                        >
                            <Icon size={20} strokeWidth={1.5} />
                            {isActive && (
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 w-full items-center pb-4">
                 <button className="text-secondary hover:text-white transition-colors">
                    <Settings size={20} strokeWidth={1.5} />
                 </button>
                 <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <User size={16} />
                 </button>
            </div>
        </nav>
    );
};

export default NavRail;
