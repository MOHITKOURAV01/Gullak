import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const ProblemSolution = () => {
    const problems = [
        "Vague charts that don't tell the real story",
        "No advice on how to reduce interest burden",
        "Hidden 'money leaks' go unnoticed for years",
        "Generic advice that doesn't fit Indian context"
    ];

    const solutions = [
        "Actionable CA-style insights on every transaction",
        "EMI optimization engine to close loans early",
        "Automated 'Leak Detection' for lifestyle spending",
        "Designed specifically for the Indian Middle Class"
    ];

    return (
        <section id="insights" className="py-24 bg-surface/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold mb-4">Why GULLAK?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Most finance apps just track where your money went. We show you where it <span className="text-white italic">should</span> go.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Problem */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-[2rem] border border-red-500/10 bg-red-500/5 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Standard Apps</h3>
                        </div>

                        <ul className="space-y-6">
                            {problems.map((p, i) => (
                                <li key={i} className="flex gap-4 items-start text-gray-400 text-lg">
                                    <XCircle className="text-red-500 mt-1 shrink-0" size={20} />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Solution */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-[2rem] border border-primary/20 bg-primary/5 relative scale-105 shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <CheckCircle2 size={120} className="text-primary" />
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">The GULLAK Way</h3>
                        </div>

                        <ul className="space-y-6">
                            {solutions.map((s, i) => (
                                <li key={i} className="flex gap-4 items-start text-white text-lg font-medium">
                                    <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="mt-10 w-full glass hover:bg-white/5 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                            Experience the difference <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
