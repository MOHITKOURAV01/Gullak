import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingDown, Calendar, Wallet, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmiSimulator = () => {
    const [extraPayment, setExtraPayment] = useState(2000);

    // Static mockup calculation for demo purposes
    const baseLoan = 2500000;
    const baseTenure = 240; // 20 years
    const savedMonths = Math.min(Math.floor(extraPayment / 100) * 3, baseTenure - 12);
    const savedInterest = Math.floor(extraPayment * 70);

    return (
        <section id="emi-optimization" className="py-24 bg-surface/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Master your <span className="text-secondary">Debt.</span></h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Our unique EMI Optimization engine doesn't just show your balance. It calculates how small, consistent extra payments can shave years off your loan tenure and lakhs off your interest.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: TrendingDown, title: "Reduce Interest", text: "Save up to 40% on total interest payable." },
                                { icon: Calendar, title: "Close Early", text: "Turn a 20-year loan into a 12-year one." },
                                { icon: Wallet, title: "Gain Liquidity", text: "Free up monthly cash flow years ahead of schedule." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-gray-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link
                                to="/emi-optimization"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-bold rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all text-lg"
                            >
                                <Brain size={20} /> Calculate your EMI with AI
                            </Link>
                        </div>
                    </div>

                    <div className="glass rounded-[2.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <IndianRupee size={150} />
                        </div>

                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <span className="text-primary">Simulator:</span> Early Closure
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-gray-400 font-medium">Extra Monthly Payment</label>
                                    <span className="text-primary font-bold text-xl">₹{extraPayment.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="500"
                                    value={extraPayment}
                                    onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>₹500</span>
                                    <span>₹10,000</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Interest Saved</p>
                                    <p className="text-2xl font-bold text-secondary">₹{savedInterest.toLocaleString()}</p>
                                </div>
                                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Time Saved</p>
                                    <p className="text-2xl font-bold text-primary">{savedMonths} Months</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                                    <TrendingDown size={20} />
                                </div>
                                <p className="text-sm">
                                    By paying <span className="text-white font-bold">₹{extraPayment}</span> extra monthly, you close your loan <span className="text-secondary font-bold">{(savedMonths / 12).toFixed(1)} years</span> earlier!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmiSimulator;
