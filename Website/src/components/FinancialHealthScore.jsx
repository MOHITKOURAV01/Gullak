import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const FinancialHealthScore = ({ income = 0, expenses = [] }) => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const savings = income - totalExpenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    const scoreData = useMemo(() => {
        // 1. Savings Rate Score (Max 400)
        // Ideally 30%+ savings rate gets full marks
        let savingsScore = Math.min(Math.max(savingsRate * 13.33, 0), 400);

        // 2. Expense Ratio Score (Max 300)
        // Ideally expenses should be < 50% of income
        const expenseRatio = income > 0 ? (totalExpenses / income) * 100 : 100;
        let expenseScore = Math.max(300 - (expenseRatio * 3), 0);

        // 3. Consistency/Mix Score (Max 300)
        // Reward having multiple categories and not just 'other'
        const uniqueCategories = new Set(expenses.map(e => e.category)).size;
        let mixScore = Math.min(uniqueCategories * 60, 300);

        const totalScore = Math.round(savingsScore + expenseScore + mixScore);

        let label, color, icon, description;
        if (totalScore >= 800) {
            label = 'Excellent';
            color = '#10B981';
            icon = <CheckCircle2 className="text-emerald-400" size={24} />;
            description = 'Your financial health is top-tier. You are building wealth rapidly.';
        } else if (totalScore >= 600) {
            label = 'Good';
            color = '#3B82F6';
            icon = <TrendingUp className="text-blue-400" size={24} />;
            description = 'You are on the right track. Small optimizations can lead to greatness.';
        } else if (totalScore >= 400) {
            label = 'Fair';
            color = '#F59E0B';
            icon = <Shield className="text-amber-400" size={24} />;
            description = 'Your finances are stable but lack a strong savings cushion.';
        } else {
            label = 'At Risk';
            color = '#EF4444';
            icon = <AlertTriangle className="text-red-400" size={24} />;
            description = 'Your spending is high relative to income. Focus on reducing fixed costs.';
        }

        return { totalScore, label, color, icon, description, savingsRate: Math.round(savingsRate) };
    }, [income, expenses, totalExpenses, savingsRate]);

    return (
        <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={120} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Score Circular Gauge */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke={scoreData.color}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={553}
                            initial={{ strokeDashoffset: 553 }}
                            animate={{ strokeDashoffset: 553 - (553 * scoreData.totalScore) / 1000 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-white"
                        >
                            {scoreData.totalScore}
                        </motion.span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Health Score</span>
                    </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        {scoreData.icon}
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                            {scoreData.label} Status
                        </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-sm">
                        {scoreData.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Savings Rate</div>
                            <div className="text-xl font-bold text-primary">{scoreData.savingsRate}%</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Health Grade</div>
                            <div className="text-xl font-bold text-white">
                                {scoreData.totalScore > 900 ? 'A+' : scoreData.totalScore > 750 ? 'A' : 'B'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialHealthScore;
