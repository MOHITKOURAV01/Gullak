import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, Target, ArrowRight, Sparkles } from 'lucide-react';

const SmartInsights = () => {
    const insights = [
        {
            title: "Spending Patterns",
            description: "Automatically identify where your money leaks. AI Advisor flags subscriptions you forgot about.",
            icon: <Brain className="text-primary" />,
            color: "peer-hover:text-primary",
            bg: "bg-primary/5"
        },
        {
            title: "Future Net Worth",
            description: "Visualize your wealth trajectory based on current savings and EMI prepayments.",
            icon: <TrendingUp className="text-secondary" />,
            color: "text-secondary",
            bg: "bg-secondary/5"
        },
        {
            title: "Risk Assessment",
            description: "Get alerts if your debt-to-income ratio exceeds safe Indian household limits.",
            icon: <Shield className="text-red-400" />,
            color: "text-red-400",
            bg: "bg-red-400/5"
        },
        {
            title: "Goal Precision",
            description: "Reverse engineer your monthly savings needed for your next house or car downpayment.",
            icon: <Target className="text-blue-400" />,
            color: "text-blue-400",
            bg: "bg-blue-400/5"
        }
    ];

    return (
        <section id="insights" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 tracking-widest uppercase">
                        <span>Intelligence Engine</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Data-Driven <span className="text-gradient">Smart Insights</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Gullak is more than just a ledger. It's your personal advisor that analyzes thousands of data points to keep your financial health in the green.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insights.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative"
                    >
                        <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 h-full flex flex-col">
                            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                                {item.description}
                            </p>
                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">
                                Explore Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Premium Visual Hint */}
            <div className="max-w-5xl mx-auto mt-20 px-4">
                <div className="glass p-1 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-white/5 to-secondary/20">
                    <div className="bg-background rounded-[2.4rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                        <div className="flex-1">
                            <h3 className="text-3xl font-black mb-4">"The 15% Rule"</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Did you know? We found that Indian users who prepay just 15% extra on their car loans save an average of <span className="text-secondary font-bold">₹1.4 Lakhs in interest</span>.
                            </p>
                            <div className="flex gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-2xl font-black text-primary">₹3.2M</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black">Capital Freed</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-2xl font-black text-secondary">2.5yr</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black">Time Saved</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-64 h-64 relative shrink-0">
                            {/* Simple pure CSS chart decoration */}
                            <div className="absolute inset-0 flex items-end justify-between gap-2">
                                {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05, duration: 1 }}
                                        className={`w-full rounded-t-lg ${i % 2 === 0 ? 'bg-primary/20' : 'bg-primary'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SmartInsights;
