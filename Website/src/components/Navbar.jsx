import React, { useState, useEffect } from 'react';
import { Wallet, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const checkUser = () => {
            const savedUser = localStorage.getItem('gullak_user');
            if (savedUser) setUser(JSON.parse(savedUser));
        };

        window.addEventListener('scroll', handleScroll);
        checkUser();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('gullak_user');
        setUser(null);
        window.location.href = '/';
    };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'EMI Optimization', path: '/#emi-optimization' },
        { name: 'Insights', path: '/insights' },
        { name: 'Calculate Expenses', path: '/calculate-expenses' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex flex-col leading-none">
                        <span className="text-[13px] font-bold text-primary tracking-widest -mb-1">मेरा</span>
                        <span className="text-2xl font-bold tracking-tighter flex items-center">
                            <span className="text-primary">GUL</span>
                            <span className="text-white">LAK</span>
                            <span className="text-sm text-primary lowercase self-end mb-0.5 ml-0.5 font-bold opacity-90">.com</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-8 mr-4 border-r border-white/10 pr-8">
                            {navItems.map((item) => (
                                item.path.startsWith('/#') ? (
                                    <a
                                        key={item.name}
                                        href={item.path}
                                        className="text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`text-sm font-medium transition-colors duration-200 ${location.pathname === item.path ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <GlobalSearch />
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Authenticated</div>
                                        <div className="text-sm font-bold text-white leading-none">{user.name}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-red-400 transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/auth" className="bg-primary hover:bg-primary-dark text-background px-6 py-2.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <GlobalSearch />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white p-2"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass absolute top-full left-0 right-0 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-6 space-y-4 bg-background/95 backdrop-blur-xl">
                        {user && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-xs font-bold text-primary mb-1">Hi, {user.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{user.email}</div>
                                </div>
                                <button onClick={handleLogout} className="text-red-400"><LogOut size={20} /></button>
                            </div>
                        )}
                        {navItems.map((item) => (
                            item.path.startsWith('/#') ? (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    className="block text-lg font-medium text-gray-300 hover:text-primary py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`block text-lg font-medium py-2 ${location.pathname === item.path ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                        {!user && (
                            <Link
                                to="/auth"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full bg-primary text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
                            >
                                Get Started <ChevronRight size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
