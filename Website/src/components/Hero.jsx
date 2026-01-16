import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Sparkles, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                            <Sparkles size={16} />
                            <span>Smart Personal Finance Assistant</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
                            Track Like a User,<br />
                            <span className="text-gradient">Grow Like a CA.</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                            GULLAK isn't just an expense tracker. It’s your digital Chartered Accountant that detects money leaks, optimizes your EMIs, and builds your net worth—automatically.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/calculate-expenses" className="bg-primary hover:bg-primary-dark text-background px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_20px_40px_rgba(255,215,0,0.15)] flex items-center justify-center gap-2">
                                Start Growing Now <IndianRupee size={20} />
                            </Link>
                            <button className="glass hover:bg-white/5 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 border-white/20">
                                How it works
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                            <div className="flex items-center gap-2 font-semibold"><ShieldCheck size={20} /> SECURE</div>
                            <div className="flex items-center gap-2 font-semibold"><TrendingUp size={20} /> ACCURATE</div>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative glass rounded-[2.5rem] p-4 border-white/10 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

                            {/* Mockup Content */}
                            <div className="relative bg-surface rounded-[1.8rem] p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-400 text-sm">Monthly Net Worth</p>
                                        <h3 className="text-3xl font-bold text-primary">₹8,42,000</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>

                                {/* Graph Placeholder */}
                                <div className="h-48 w-full bg-surface-lighter rounded-2xl flex items-end gap-2 p-4">
                                    {[40, 60, 45, 80, 55, 95, 85].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                                            className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-md relative group/bar"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">CA Insight</span>
                                        <span className="text-secondary font-medium">Suggestion</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm leading-relaxed">
                                        "₹2,000 extra EMI payment toward your Home Loan could save you <span className="text-primary font-bold">₹1.4 Lakhs</span> in interest."
                                    </div>
                                </div>
                            </div>

                            {/* Floaties */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -right-6 glass p-4 rounded-2xl border-primary/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <IndianRupee size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Health Score</p>
                                        <p className="font-bold">84/100</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
