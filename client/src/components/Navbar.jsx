import React, { useState, useEffect } from 'react';
import { Wallet, Menu, X, ChevronRight, LogOut, ShieldCheck, Copy, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const [setupStep, setSetupStep] = useState(1); // 1: QR, 2: Success
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

    const start2FASetup = async () => {
        if (!user) return;
        setSetupStep(1);
        setToken('');
        setShow2FAModal(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/2fa/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            const data = await res.json();
            if (data.qrCode) {
                setQrCodeUrl(data.qrCode);
                setSecret(data.secret);
            }
        } catch (err) {
            console.error("Failed to start 2FA setup", err);
        }
    };

    const verify2FA = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, token })
            });

            if (res.ok) {
                setSetupStep(2);

                // Update local storage and state
                const updatedUser = { ...user, twoFactorEnabled: true };
                localStorage.setItem('gullak_user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                setTimeout(() => {
                    setShow2FAModal(false);
                }, 2000);
            } else {
                alert("Invalid Code. Please try again.");
            }
        } catch (err) {
            alert("Verification failed.");
        }
    };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'EMI Optimization', path: '/#emi-optimization' },
        { name: 'Insights', path: '/insights' },
        { name: 'Calculate Expenses', path: '/calculate-expenses' },
        { name: 'Cards', path: '/cards' },
    ];

    return (
        <>
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

                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        localStorage.setItem('gullak_2fa_seen', 'true');
                                                        start2FASetup();
                                                    }}
                                                    className={`p-2 rounded-full transition-all ${!user.twoFactorEnabled && !localStorage.getItem('gullak_2fa_seen')
                                                        ? 'bg-red-500/20 text-red-500 animate-pulse'
                                                        : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-primary'
                                                        }`}
                                                    title="Enable 2FA"
                                                >
                                                    <ShieldCheck size={20} />
                                                </button>

                                                {/* 2FA Nudge Tooltip */}
                                                {!user.twoFactorEnabled && !localStorage.getItem('gullak_2fa_seen') && (
                                                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-background border border-red-500/30 p-3 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] z-50 animate-in fade-in slide-in-from-top-2 pointer-events-none">
                                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-t border-l border-red-500/30 rotate-45"></div>
                                                        <div className="flex items-center gap-3 relative z-10">
                                                            <div className="p-1.5 bg-red-500/10 rounded-full text-red-500 shrink-0">
                                                                <ShieldCheck size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-bold text-white leading-tight">Action Required</p>
                                                                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Enable 2FA for account safety</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-red-400 transition-all"
                                                title="Logout"
                                            >
                                                <LogOut size={20} />
                                            </button>
                                        </div>
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
                                    <div className="flex gap-4">
                                        <button onClick={start2FASetup} className="text-primary"><ShieldCheck size={20} /></button>
                                        <button onClick={handleLogout} className="text-red-400"><LogOut size={20} /></button>
                                    </div>
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

            {/* 2FA Setup Modal */}
            <AnimatePresence>
                {show2FAModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Setup 2-Step Verification</h3>
                                <p className="text-xs text-gray-400">
                                    Protect your Gullak account with an extra layer of security.
                                </p>
                            </div>

                            {setupStep === 1 ? (
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 flex items-center justify-center">
                                        {qrCodeUrl ? (
                                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
                                        ) : (
                                            <div className="animate-pulse w-full h-full bg-gray-200 rounded-lg"></div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Manual Entry Key</p>
                                        <code className="bg-white/5 px-3 py-1 rounded text-xs text-primary font-mono select-all">
                                            {secret || 'Generating...'}
                                        </code>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">Enter 6-digit Code</label>
                                        <input
                                            type="text"
                                            placeholder="000 000"
                                            maxLength="6"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-primary/50 transition-all text-white"
                                        />
                                    </div>

                                    <button
                                        onClick={verify2FA}
                                        disabled={token.length !== 6}
                                        className="w-full bg-primary text-background font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors"
                                    >
                                        Verify & Enable
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                        <Check size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">You're All Set!</h4>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Two-factor authentication is now enabled on your account.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
