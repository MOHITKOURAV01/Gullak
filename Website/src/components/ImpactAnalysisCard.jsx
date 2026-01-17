import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

/**
 * Impact Analysis Card - Shows savings from extra payments
 * Displays interest saved and time saved in months
 */
export const ImpactAnalysisCard = ({ baseline, totalInterest, totalDuration, extraPayment }) => {
    if (extraPayment <= 0) return null;

    const interestSaved = Math.round(Math.max(0, baseline.totalInterest - totalInterest));
    const timeSaved = Math.max(0, baseline.totalDuration - totalDuration);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20"
        >
            <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <TrendingDown size={14} /> Impact Analysis
            </div>
            <div className="flex flex-col gap-1">
                <div className="text-2xl font-black text-white">
                    ₹{interestSaved.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Interest Saved</div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Time Saved</span>
                <span className="text-sm font-bold text-emerald-400">{timeSaved} Months</span>
            </div>
        </motion.div>
    );
};
