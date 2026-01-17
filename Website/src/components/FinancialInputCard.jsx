// Financial Input Section Component
export const FinancialInputCard = ({ income, setIncome, livingExpenses, setLivingExpenses, monthlyBalance }) => {
    return (
        <div className="glass p-6 rounded-3xl border-white/5 bg-white/[0.02]">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                        Monthly Income
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">₹</span>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number(e.target.value))}
                            className="w-full bg-background/50 border-2 border-primary/20 rounded-xl pl-12 pr-4 py-3 text-2xl font-black focus:outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                        Living Expenses (Rent, Food, etc.)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">₹</span>
                        <input
                            type="number"
                            value={livingExpenses}
                            onChange={(e) => setLivingExpenses(Number(e.target.value))}
                            className="w-full bg-background/50 border-2 border-orange-500/20 rounded-xl pl-12 pr-4 py-3 text-2xl font-black focus:outline-none focus:border-orange-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                        Available for Loans/Savings
                    </label>
                    <div className={`text-3xl font-black ${monthlyBalance < 0 ? 'text-red-500' : 'text-secondary'}`}>
                        ₹{monthlyBalance.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                        {monthlyBalance < 0 ? 'Deficit Warning' : 'Surplus available'}
                    </div>
                </div>
            </div>
        </div>
    );
};
