import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // Ensure no double slashes, and trim trailing slash from API_URL
            const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            const res = await fetch(`${baseUrl}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('OTP sent to your email. Please check your inbox.');
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            setError(`Connection Error: Trying to reach ${baseUrl}. Please check VITE_API_URL in Vercel settings.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass p-8 rounded-[2rem] border-white/10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-primary" size={32} />
                    </div>
                    <h2 className="text-3xl font-black mb-2">Forgot Password?</h2>
                    <p className="text-gray-400 text-sm">No worries! Enter your email and we'll send you an OTP to reset it.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-background font-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Sending Request...' : (
                            <>
                                Send OTP <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-3 text-secondary"
                    >
                        <CheckCircle2 size={18} />
                        <p className="text-xs font-bold">{message}</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
                    >
                        <AlertCircle size={18} />
                        <p className="text-xs font-bold">{error}</p>
                    </motion.div>
                )}

                <div className="mt-8 text-center">
                    <a href="/auth" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
                        Back to Login
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
