import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, Zap, TrendingUp, TrendingDown, Calculator, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Icon helper to render the correct component from a string
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'calculator': return <Calculator size={18} className="text-primary" />;
            case 'trending-down': return <TrendingDown size={18} className="text-secondary" />;
            case 'trending-up': return <TrendingUp size={18} className="text-green-400" />;
            case 'zap': return <Zap size={18} className="text-orange-400" />;
            case 'wallet': return <Wallet size={18} className="text-blue-400" />;
            default: return <Search size={18} />;
        }
    };

    // Mock searchable items
    const searchableItems = [
        { id: '1', title: 'Expense Calculator', description: 'Track and optimize your monthly spending', path: '/calculate-expenses', icon: 'calculator' },
        { id: '2', title: 'Debt Optimizer', description: 'Smart strategy to pay off loans faster', path: '/debt-optimizer', icon: 'trending-down' },
        { id: '3', title: 'EMI Simulator', description: 'Visualize your loan repayments', path: '/#emi-optimization', icon: 'zap' },
        { id: '4', title: 'Financial Goal Setting', description: 'Set and track your wealth targets', path: '/', icon: 'wallet' },
        { id: '5', title: 'Fixed vs Variable Expenses', description: 'Learn the difference and optimize', path: '/calculate-expenses', icon: 'trending-up' },
    ];

    useEffect(() => {
        // Load recent searches from localStorage for "Fast Load"
        try {
            const saved = localStorage.getItem('gullak_recent_searches');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Sanitize to make sure we don't have broken circular refs or JSX
                setRecentSearches(parsed.filter(item => typeof item.icon === 'string'));
            }
        } catch (e) {
            console.error("Failed to load recent searches", e);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (val.length > 0) {
            setIsLoading(true);
            const filtered = searchableItems.filter(item =>
                item.title.toLowerCase().includes(val.toLowerCase()) ||
                item.description.toLowerCase().includes(val.toLowerCase())
            );

            setTimeout(() => {
                setResults(filtered);
                setIsLoading(false);
            }, 100);
        } else {
            setResults([]);
        }
    };

    const saveSearch = (item) => {
        // Only save clean objects without JSX
        const cleanedItem = {
            id: item.id,
            title: item.title,
            description: item.description,
            path: item.path,
            icon: item.icon
        };

        const updated = [cleanedItem, ...recentSearches.filter(s => s.id !== cleanedItem.id)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('gullak_recent_searches', JSON.stringify(updated));

        fetch('/api/search/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: item.title, timestamp: new Date() })
        }).catch(err => console.log('Backend sync offline'));

        if (item.path.startsWith('/#')) {
            window.location.href = item.path;
        } else {
            navigate(item.path);
        }
        setIsOpen(false);
        setQuery('');
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('gullak_recent_searches');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all group lg:min-w-[140px]"
                title="Search Gullak (⌘K)"
            >
                <Search size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <span className="hidden lg:inline text-xs font-bold text-gray-500 group-hover:text-gray-300">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-gray-400 font-mono font-bold leading-none">
                    <span>⌘</span>
                    <span>K</span>
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-[#171717] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/[0.02]">
                                <Search className="text-gray-500" size={24} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={handleSearch}
                                    placeholder="Try 'expenses' or 'debt'..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-white text-xl placeholder:text-gray-600 outline-none"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-6 scrollbar-hide">
                                {query.length === 0 ? (
                                    <div className="space-y-6">
                                        {recentSearches.length > 0 && (
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Clock size={14} /> Recent Searches
                                                    </h3>
                                                    <button onClick={clearRecent} className="text-[10px] font-bold text-gray-600 hover:text-red-400 uppercase tracking-widest">Clear All</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {recentSearches.map(item => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => saveSearch(item)}
                                                            className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex items-center justify-between group transition-all"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-2.5 rounded-xl bg-white/5 text-gray-400 group-hover:bg-primary/10 transition-colors">
                                                                    {getIcon(item.icon)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white group-hover:text-primary transition-colors">{item.title}</div>
                                                                    <div className="text-xs text-gray-500">{item.description}</div>
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={16} className="text-gray-700 group-hover:text-primary transform lg:group-hover:translate-x-1 transition-all" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Quick Tools</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {searchableItems.filter(i => !recentSearches.find(rs => rs.id === i.id)).slice(0, 4).map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => saveSearch(item)}
                                                        className="text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                                                {getIcon(item.icon)}
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.title}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {isLoading ? (
                                            <div className="py-12 text-center">
                                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                                <p className="text-gray-500 text-sm font-bold tracking-tight">Accessing GULLAK Knowledge Base...</p>
                                            </div>
                                        ) : results.length > 0 ? (
                                            results.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => saveSearch(item)}
                                                    className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex items-center justify-between group transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 rounded-xl bg-white/5 text-gray-400 group-hover:bg-primary/10 transition-colors">
                                                            {getIcon(item.icon)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white group-hover:text-primary transition-colors">{item.title}</div>
                                                            <div className="text-xs text-gray-500">{item.description}</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={16} className="text-gray-700 group-hover:text-primary transform lg:group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Search className="text-gray-700" size={32} />
                                                </div>
                                                <h4 className="text-white font-bold mb-1">No results for "{query}"</h4>
                                                <p className="text-gray-500 text-sm">We couldn't find any tools matching that term.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/5 flex justify-between items-center px-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white border border-white/5 font-mono">ESC</kbd>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">to close</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white border border-white/5 font-mono">↵</kbd>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">to select</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Gullak v1.0 • Smart Analysis</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalSearch;
