import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Wallet, CheckCircle2, ShieldCheck, AlertTriangle, Smartphone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Auth = () => {
    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot', 'verify-2fa'
    const [formData, setFormData] = useState({ name: '', email: '', password: '', token: '' });
    const [tempUserId, setTempUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            let endpoint = '';
            let body = {};

            if (mode === 'login') {
                endpoint = '/api/auth/login';
                body = { email: formData.email, password: formData.password };
            } else if (mode === 'signup') {
                endpoint = '/api/auth/signup';
                body = formData;
            } else if (mode === 'forgot') {
                endpoint = '/api/auth/forgot-password';
                body = { email: formData.email };
            } else if (mode === 'verify-2fa') {
                endpoint = '/api/auth/login/2fa';
                body = { userId: tempUserId, token: formData.token };
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server is unreachable or offline. Please run 'npm run dev' from the root folder.");
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Action failed');
            }

            // Handle Success Cases
            if (mode === 'forgot') {
                setSuccess(data.message);
                setTimeout(() => setMode('login'), 3000);
            }
            else if (mode === 'login') {
                if (data.require2fa) {
                    setTempUserId(data.userId);
                    setMode('verify-2fa');
                    setSuccess('Please enter your 2FA code.');
                } else {
                    completeLogin(data.user);
                }
            }
            else if (mode === 'verify-2fa') {
                completeLogin(data.user);
            }
            else { // signup
                completeLogin(data.user);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const completeLogin = (user) => {
        localStorage.setItem('gullak_user', JSON.stringify(user));
        navigate('/calculate-expenses');
        // Small delay to ensure navigation, then reload to update navbar state
        setTimeout(() => window.location.reload(), 100);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-28">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1000px] grid md:grid-cols-2 glass rounded-[3rem] overflow-hidden border-white/5 shadow-2xl shadow-primary/5"
            >
                {/* Left Side: Brand/Info */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-primary/5 border-r border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                    <div className="relative z-10">
                        <Link to="/" className="flex flex-col leading-none mb-12">
                            <span className="text-[13px] font-bold text-primary tracking-widest -mb-1">मेरा</span>
                            <span className="text-3xl font-black tracking-tighter">
                                <span className="text-primary">GUL</span>
                                <span className="text-white">LAK</span>
                                <span className="text-sm text-primary lowercase self-end mb-1 ml-0.5 font-bold opacity-90">.com</span>
                            </span>
                        </Link>

                        <h2 className="text-4xl font-black leading-tight mb-6">
                            Start your journey to <span className="text-gradient">Financial Freedom.</span>
                        </h2>

                        <div className="space-y-4 text-gray-400">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-secondary" size={20} />
                                <span className="text-sm font-medium">Precision Expense Tracking</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-secondary" size={20} />
                                <span className="text-sm font-medium">Smart Debt Optimization</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-secondary" size={20} />
                                <span className="text-sm font-medium">Bank-level Data Security</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 p-6 glass rounded-2xl border-white/10 bg-white/5">
                        <p className="text-xs text-gray-500 italic mb-2">"Gullak changed how I look at my salary. I saved 2L in interest in just 4 months."</p>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Aditya K. • Verified User</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-16 flex flex-col justify-center bg-white/[0.01]">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black mb-2">
                            {mode === 'login' ? 'Welcome Back' :
                                mode === 'signup' ? 'Create Account' :
                                    mode === 'verify-2fa' ? 'Two-Factor Auth' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {mode === 'login' && "Enter your credentials to access your vault."}
                            {mode === 'signup' && "Join 10,000+ Indians mastering their money."}
                            {mode === 'verify-2fa' && "Enter the 6-digit code from your authenticator app."}
                            {mode === 'forgot' && "We'll send you a link to get back into your account."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                {success}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* Signup Name Field */}
                            {mode === 'signup' && (
                                <motion.div
                                    key="signup-name"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
                                    />
                                </motion.div>
                            )}

                            {/* Standard Email/Password Fields (Hidden for 2FA) */}
                            {mode !== 'verify-2fa' && (
                                <motion.div
                                    key="standard-fields"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <div className="relative mb-5">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            type="email"
                                            required={mode !== 'verify-2fa'}
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>

                                    {mode !== 'forgot' && (
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input
                                                type="password"
                                                required={mode !== 'verify-2fa'}
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all text-sm font-medium"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* 2FA Token Field */}
                            {mode === 'verify-2fa' && (
                                <motion.div
                                    key="2fa-field"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="relative"
                                >
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        placeholder="000 000"
                                        value={formData.token}
                                        onChange={(e) => setFormData({ ...formData, token: e.target.value.replace(/\D/g, '') })}
                                        className="w-full bg-white/5 border border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white text-xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-primary transition-all shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {mode === 'login' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setMode('forgot')}
                                    className="text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-background py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Login to Vault' :
                                        mode === 'signup' ? 'Secure my Gullak' :
                                            mode === 'verify-2fa' ? 'Verify Authenticator' : 'Send Reset Link'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        {mode === 'login' ? "First time here?" :
                            mode === 'verify-2fa' ? "Lost your device?" : "Remembered your password?"}

                        <button
                            onClick={() => {
                                if (mode === 'verify-2fa') {
                                    alert("Contact support at support@gullak.com to reset your 2FA.");
                                } else {
                                    setMode(mode === 'login' ? 'signup' : 'login');
                                }
                            }}
                            className="ml-2 text-primary font-bold hover:underline"
                        >
                            {mode === 'login' ? 'Create Account' :
                                mode === 'verify-2fa' ? 'Get Help' : 'Back to Login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
