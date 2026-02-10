import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, Target, IndianRupee, AlertTriangle, CheckCircle2, ArrowUpRight, Zap, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import FinancialHealthScore from '../components/FinancialHealthScore';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Insights = () => {
    const [data, setData] = useState({ expenses: [], income: 0 });
    const [debtData, setDebtData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try backend first
                const res = await fetch(`${API_URL}/api/expenses`);
                if (res.ok) {
                    const backendData = await res.json();
                    if (backendData && backendData.expenses) {
                        setData(backendData);
                    }
                } else {
                    throw new Error('Backend offline or error');
                }
            } catch (error) {
                console.log("Backend offline, using localStorage");
                const savedEx = localStorage.getItem('gullak_expenses');
                const savedInc = localStorage.getItem('gullak_income');
                if (savedEx) setData({
                    expenses: JSON.parse(savedEx),
                    income: Number(savedInc) || 50000
                });
            } finally {
                const savedDebts = localStorage.getItem('gullak_debt_emis');
                if (savedDebts) setDebtData(JSON.parse(savedDebts));
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const metrics = useMemo(() => {
        const totalEx = data.expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const savings = data.income - totalEx;
        const savingsRate = data.income > 0 ? (savings / data.income) * 100 : 0;

        const luxuryExp = data.expenses.filter(e => e.category === 'Luxury').reduce((a, b) => a + Number(b.amount), 0);
        const fixedExp = data.expenses.filter(e => e.category === 'Fixed').reduce((a, b) => a + Number(b.amount), 0);

        const totalDebt = debtData.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
        const monthlyDebtCommitment = debtData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

        // Calculate Health Score (Simple algorithm)
        let score = 50;
        if (savingsRate > 20) score += 20;
        if (savingsRate > 40) score += 10;
        if (luxuryExp < (data.income * 0.1)) score += 10;
        if (totalDebt === 0) score += 10;
        if (monthlyDebtCommitment > (data.income * 0.4)) score -= 20;

        return {
            totalEx,
            savings,
            savingsRate,
            luxuryExp,
            fixedExp,
            totalDebt,
            monthlyDebtCommitment,
            score: Math.min(Math.max(score, 10), 99)
        };
    }, [data, debtData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 min-h-screen bg-background text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Health Score Section */}
                <div className="mb-12">
                    <FinancialHealthScore income={data.income} expenses={data.expenses} />
                </div>


                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Side: Major Stats */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02]"
                            >
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Cash Flow</span>
                                <div className="text-3xl font-black mb-1">₹{metrics.savings.toLocaleString()}</div>
                                <div className="text-xs text-secondary font-bold flex items-center gap-1">
                                    Monthly Savings Potential
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02]"
                            >
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Leisure Spent</span>
                                <div className="text-3xl font-black mb-1">₹{metrics.luxuryExp.toLocaleString()}</div>
                                <div className={`text-xs font-bold ${metrics.luxuryExp > (data.income * 0.15) ? 'text-red-400' : 'text-gray-500'}`}>
                                    {Math.round((metrics.luxuryExp / data.income) * 100)}% of your income
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02]"
                            >
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Total Liabilities</span>
                                <div className="text-3xl font-black mb-1">₹{(metrics.totalDebt / 100000).toFixed(1)}L</div>
                                <div className="text-xs text-gray-500 font-bold">Outstanding Principle</div>
                            </motion.div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-[2.5rem] border-white/5">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Shield size={20} className="text-primary" />
                                    Stability Check
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-gray-400">Fixed Cost Ratio</span>
                                            <span className={metrics.fixedExp > (data.income * 0.5) ? 'text-red-400' : 'text-secondary'}>
                                                {Math.round((metrics.fixedExp / data.income) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${metrics.fixedExp > (data.income * 0.5) ? 'bg-red-400' : 'bg-primary'}`}
                                                style={{ width: `${Math.min((metrics.fixedExp / data.income) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 leading-relaxed italic">
                                        "Your fixed costs are {metrics.fixedExp > (data.income * 0.5) ? 'high' : 'well-managed'}.
                                        {metrics.fixedExp > (data.income * 0.5) ? ' Consider refinancing high-interest loans to free up monthly cash.' : ' You have good financial agility for investments.'}"
                                    </p>
                                </div>
                            </div>

                            <div className="glass p-8 rounded-[2.5rem] border-white/5">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Target size={20} className="text-secondary" />
                                    Wealth Accelerator
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Savings Rate</div>
                                            <div className="text-2xl font-black">{Math.round(metrics.savingsRate)}%</div>
                                        </div>
                                        <ArrowUpRight className="text-secondary" size={32} />
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Increasing your savings by just <span className="text-white font-bold">5%</span> could add <span className="text-secondary font-bold">₹{(data.income * 0.05 * 12).toLocaleString()}</span> to your net worth annually.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: AI Munshi recommendations */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-8">
                                AI Counsel
                            </h3>

                            <div className="space-y-6">
                                {metrics.savingsRate < 20 && (
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-red-400/20 text-red-400 flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">Savings Alert</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">Your savings rate is below 20%. Try the "30-Day No-Spend" challenge on Luxury items.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                        <IndianRupee size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">Debt Optimization</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            {metrics.monthlyDebtCommitment > 0
                                                ? `You are paying ₹${metrics.monthlyDebtCommitment.toLocaleString()} in EMIs. Use our Debt Optimizer to save interest.`
                                                : "Excellent! You are debt-free. Your wealth building will be 2.5x faster than average."}
                                        </p>
                                        <Link to="/debt-optimizer" className="text-[10px] font-black text-primary uppercase mt-2 block hover:underline">Launch Tool →</Link>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-400/20 text-blue-400 flex items-center justify-center">
                                        <Calculator size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">Tax Planning</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">Ensure your Fixed expenses like Insurance and ELSS are logged to maximize tax savings.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-10 py-4 bg-primary text-background font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
                                Download Health Report
                            </button>
                        </div>

                        {/* Pro Tip */}
                        <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                PRO TIP
                            </div>
                            <p className="text-sm text-gray-300 italic leading-relaxed">
                                "Financial freedom is not about how much you earn, but how much you keep and how hard it works for you."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
