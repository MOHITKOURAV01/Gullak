import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { IndianRupee, Save, Brain, Info, X, Zap, ChevronRight, Calculator, Table, TrendingUp, DollarSign, Download, ArrowUpCircle } from 'lucide-react';

const EmiCalculator = () => {
    const [amount, setAmount] = useState(2500000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [isSaved, setIsSaved] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [activeTab, setActiveTab] = useState('calculator'); // calculator, amortization, prepayment, comparison, myemis
    const [prepaymentAmount, setPrepaymentAmount] = useState(50000);
    const [prepaymentType, setPrepaymentType] = useState('yearly'); // monthly, yearly, onetime


    // Saved EMIs state
    const [savedEmis, setSavedEmis] = useState([]);
    const [editingEmiId, setEditingEmiId] = useState(null);
    const [emiName, setEmiName] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('gullak_emi_data');
        if (savedData) {
            const { amount, rate, tenure } = JSON.parse(savedData);
            setAmount(amount);
            setRate(rate);
            setTenure(tenure);
        }

        // Load saved EMIs list
        const savedEmisList = localStorage.getItem('gullak_saved_emis');
        if (savedEmisList) {
            setSavedEmis(JSON.parse(savedEmisList));
        }
    }, []);

    const saveConfiguration = () => {
        localStorage.setItem('gullak_emi_data', JSON.stringify({ amount, rate, tenure }));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    // Save EMI to list
    const saveEmiToList = () => {
        if (!emiName.trim()) {
            alert('Please enter a name for this EMI');
            return;
        }

        const newEmi = {
            id: editingEmiId || Date.now(),
            name: emiName,
            amount,
            rate,
            tenure,
            createdAt: editingEmiId ? savedEmis.find(e => e.id === editingEmiId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        let updatedEmis;
        if (editingEmiId) {
            // Update existing EMI
            updatedEmis = savedEmis.map(emi => emi.id === editingEmiId ? newEmi : emi);
        } else {
            // Add new EMI
            updatedEmis = [...savedEmis, newEmi];
        }

        setSavedEmis(updatedEmis);
        localStorage.setItem('gullak_saved_emis', JSON.stringify(updatedEmis));
        setShowSaveModal(false);
        setEmiName('');
        setEditingEmiId(null);
    };

    // Load EMI from saved list
    const loadEmi = (emi) => {
        setAmount(emi.amount);
        setRate(emi.rate);
        setTenure(emi.tenure);
        setActiveTab('calculator');
    };

    // Edit EMI
    const editEmi = (emi) => {
        setAmount(emi.amount);
        setRate(emi.rate);
        setTenure(emi.tenure);
        setEmiName(emi.name);
        setEditingEmiId(emi.id);
        setShowSaveModal(true);
    };

    // Delete EMI
    const deleteEmi = (id) => {
        if (window.confirm('Are you sure you want to delete this EMI?')) {
            setSavedEmis(prevEmis => {
                const updatedEmis = prevEmis.filter(emi => emi.id !== id);
                localStorage.setItem('gullak_saved_emis', JSON.stringify(updatedEmis));
                return updatedEmis;
            });
        }
    };

    // Calculations
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    const totalAmount = emi * months;
    const totalInterest = totalAmount - amount;

    // Generate Amortization Schedule
    const generateAmortizationSchedule = () => {
        const schedule = [];
        let balance = amount;

        for (let month = 1; month <= months; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = emi - interestPayment;
            balance = balance - principalPayment;

            if (month <= 120) { // Show only first 10 years for performance
                schedule.push({
                    month,
                    year: Math.ceil(month / 12),
                    emi,
                    principal: Math.round(principalPayment),
                    interest: Math.round(interestPayment),
                    balance: Math.round(Math.max(0, balance))
                });
            }
        }
        return schedule;
    };

    // Calculate Prepayment Impact
    const calculatePrepayment = () => {
        let balance = amount;
        let totalMonths = 0;
        let totalInterestPaid = 0;
        const prepaymentFrequency = prepaymentType === 'monthly' ? 1 : prepaymentType === 'yearly' ? 12 : 0;

        for (let month = 1; month <= months; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = emi - interestPayment;
            balance -= principalPayment;
            totalInterestPaid += interestPayment;

            // Apply prepayment
            if (prepaymentFrequency > 0 && month % prepaymentFrequency === 0) {
                balance -= prepaymentAmount;
            } else if (prepaymentType === 'onetime' && month === 12) {
                balance -= prepaymentAmount;
            }

            totalMonths = month;
            if (balance <= 0) break;
        }

        return {
            newTenure: totalMonths,
            totalInterest: Math.round(totalInterestPaid),
            savedMonths: months - totalMonths,
            savedInterest: Math.round(totalInterest - totalInterestPaid)
        };
    };



    const amortizationSchedule = generateAmortizationSchedule();
    const prepaymentImpact = calculatePrepayment();

    // Chart data for timeline
    const timelineData = amortizationSchedule.filter((_, i) => i % 6 === 0).map(item => ({
        year: item.year,
        principal: item.principal,
        interest: item.interest,
        balance: item.balance / 100000
    }));

    const chartData = [
        { name: 'Principal Amount', value: amount },
        { name: 'Total Interest', value: totalInterest },
    ];

    const COLORS = ['#10B981', '#FFD700'];

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black mb-2">EMI <span className="text-primary">Calculator</span></h2>
                    <p className="text-gray-400">Plan your loan repayment with our easy-to-use calculator.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button
                        onClick={() => setShowAI(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                    >
                        <Brain size={18} />
                        Calculate with AI
                    </button>
                    <button
                        onClick={() => setShowSaveModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 text-secondary font-bold rounded-xl transition-all text-sm"
                    >
                        <Save size={18} />
                        Save to My EMIs
                    </button>
                    <button
                        onClick={saveConfiguration}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm"
                    >
                        {!isSaved ? <Save size={18} /> : <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                        {isSaved ? 'Saved!' : 'Save Config'}
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'calculator', label: 'Calculator', icon: Calculator },
                    { id: 'myemis', label: `My EMIs ${savedEmis.length > 0 ? `(${savedEmis.length})` : ''}`, icon: Save },
                    { id: 'amortization', label: 'Schedule', icon: Table },
                    { id: 'prepayment', label: 'Prepayment', icon: ArrowUpCircle }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-primary text-background shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                            : 'glass border-white/5 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Calculator Tab */}
            {activeTab === 'calculator' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid lg:grid-cols-2 gap-8"
                >
                    {/* Inputs Section */}
                    <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
                        {/* Loan Amount */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <IndianRupee size={14} className="text-primary" /> Loan Amount
                                </label>
                                <input
                                    type="number"
                                    min="5000"
                                    max="10000000"
                                    value={amount}
                                    onChange={(e) => setAmount(Math.max(5000, Math.min(10000000, parseInt(e.target.value) || 0)))}
                                    className="text-xl font-black bg-white/5 px-4 py-1 rounded-lg border border-white/10 w-48 text-right focus:outline-none focus:border-primary transition-all"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="10000000"
                                step="5000"
                                value={amount}
                                onChange={(e) => setAmount(parseInt(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary hover:accent-secondary/80 transition-all"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase">
                                <span>₹5K</span>
                                <span>₹1Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} className="text-primary" /> Rate of Interest (p.a)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    step="0.1"
                                    value={rate}
                                    onChange={(e) => setRate(Math.max(1, Math.min(30, parseFloat(e.target.value) || 0)))}
                                    className="text-xl font-black bg-white/5 px-4 py-1 rounded-lg border border-white/10 w-32 text-right focus:outline-none focus:border-primary transition-all"
                                    placeholder="Enter rate"
                                />
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase">
                                <span>1%</span>
                                <span>30%</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calculator size={14} className="text-primary" /> Loan Tenure
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={tenure}
                                    onChange={(e) => setTenure(Math.max(1, Math.min(30, parseInt(e.target.value) || 0)))}
                                    className="text-xl font-black bg-white/5 px-4 py-1 rounded-lg border border-white/10 w-32 text-right focus:outline-none focus:border-primary transition-all"
                                    placeholder="Years"
                                />
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={tenure}
                                onChange={(e) => setTenure(parseInt(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary hover:accent-secondary/80 transition-all"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase">
                                <span>1 Yr</span>
                                <span>30 Yr</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex-1 glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center relative">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Total Amount</span>
                                <div className="text-xl font-black">₹{(totalAmount / 100000).toFixed(2)}L</div>
                            </div>

                            <div className="flex gap-8 w-full justify-center mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Principal</p>
                                        <p className="font-bold">₹{amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Total Interest</p>
                                        <p className="font-bold">₹{totalInterest.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Monthly EMI</p>
                            <h3 className="text-4xl md:text-5xl font-black text-primary mb-6">₹{emi.toLocaleString()}</h3>

                            <button
                                onClick={() => setShowTips(true)}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-background font-black rounded-xl text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            >
                                Savings Tips
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Amortization Schedule Tab */}
            {activeTab === 'amortization' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                >
                    <div className="glass p-8 rounded-[2.5rem] border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-black mb-1">Amortization <span className="text-secondary">Schedule</span></h3>
                                <p className="text-sm text-gray-400">Month-by-month payment breakdown for your ₹{(amount / 100000).toFixed(2)}L loan</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl hover:bg-secondary/20 transition-all">
                                <Download size={18} />
                                Export
                            </button>
                        </div>

                        {/* Enhanced Timeline Chart */}
                        <div className="mb-8 bg-black/20 p-6 rounded-2xl">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 20, bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.3} />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#888"
                                        label={{ value: 'Years', position: 'insideBottom', offset: -10, fill: '#888', fontSize: 12, fontWeight: 'bold' }}
                                        tick={{ fill: '#888', fontSize: 11 }}
                                    />
                                    <YAxis
                                        stroke="#888"
                                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 12, fontWeight: 'bold' }}
                                        tick={{ fill: '#888', fontSize: 11 }}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0A0A0A',
                                            border: '1px solid #333',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#FFD700', marginBottom: '8px', fontWeight: 'bold' }}
                                        formatter={(value, name) => {
                                            if (name === 'Balance (Lakhs)') {
                                                return [`₹${value.toFixed(2)}L`, name];
                                            }
                                            return [`₹${value.toLocaleString()}`, name];
                                        }}
                                        labelFormatter={(label) => `Year ${label}`}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="principal"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        name="Principal Payment"
                                        dot={{ fill: '#10B981', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="interest"
                                        stroke="#FFD700"
                                        strokeWidth={3}
                                        name="Interest Payment"
                                        dot={{ fill: '#FFD700', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        name="Balance (Lakhs)"
                                        dot={{ fill: '#8B5CF6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-400 uppercase mb-1">Total EMI Payments</p>
                                <p className="text-2xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-400 uppercase mb-1">Total Principal</p>
                                <p className="text-2xl font-black text-secondary">₹{amount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-400 uppercase mb-1">Total Interest</p>
                                <p className="text-2xl font-black text-primary">₹{totalInterest.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Improved Table */}
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5">
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-6 text-gray-300 font-bold uppercase text-xs tracking-wider sticky left-0 bg-surface">Month</th>
                                        <th className="text-right py-4 px-6 text-gray-300 font-bold uppercase text-xs tracking-wider">EMI</th>
                                        <th className="text-right py-4 px-6 text-gray-300 font-bold uppercase text-xs tracking-wider">Principal</th>
                                        <th className="text-right py-4 px-6 text-gray-300 font-bold uppercase text-xs tracking-wider">Interest</th>
                                        <th className="text-right py-4 px-6 text-gray-300 font-bold uppercase text-xs tracking-wider">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-black/20">
                                    {amortizationSchedule.slice(0, 36).map((row, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 12 === 11 ? 'bg-primary/5 border-primary/20' : ''
                                                }`}
                                        >
                                            <td className="py-4 px-6 font-bold sticky left-0 bg-surface">
                                                {row.month}
                                                {index % 12 === 11 && <span className="ml-2 text-xs text-primary">(Year {row.year})</span>}
                                            </td>
                                            <td className="text-right py-4 px-6 font-medium">₹{row.emi.toLocaleString()}</td>
                                            <td className="text-right py-4 px-6 text-secondary font-bold">₹{row.principal.toLocaleString()}</td>
                                            <td className="text-right py-4 px-6 text-primary font-bold">₹{row.interest.toLocaleString()}</td>
                                            <td className="text-right py-4 px-6 text-gray-300 font-medium">₹{row.balance.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Showing first 3 years • Total tenure: {tenure} years ({months} months)
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Prepayment Strategy Tab */}
            {activeTab === 'prepayment' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid lg:grid-cols-2 gap-8"
                >
                    <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                        <div>
                            <h3 className="text-2xl font-black mb-1">Prepayment <span className="text-primary">Strategy</span></h3>
                            <p className="text-sm text-gray-400">See how extra payments can save you lakhs</p>
                        </div>

                        {/* Prepayment Amount */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Extra Payment</label>
                                <span className="text-xl font-black bg-white/5 px-4 py-1 rounded-lg border border-white/5">
                                    ₹{prepaymentAmount.toLocaleString()}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="500000"
                                step="10000"
                                value={prepaymentAmount}
                                onChange={(e) => setPrepaymentAmount(parseInt(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary transition-all"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase">
                                <span>₹10K</span>
                                <span>₹5L</span>
                            </div>
                        </div>

                        {/* Prepayment Type */}
                        <div>
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">Payment Frequency</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'monthly', label: 'Monthly' },
                                    { id: 'yearly', label: 'Yearly' },
                                    { id: 'onetime', label: 'One-time' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setPrepaymentType(type.id)}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${prepaymentType === type.id
                                            ? 'bg-primary text-background'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-[2.5rem] border-secondary/20 bg-secondary/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-6">Impact Analysis</h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <p className="text-xs text-gray-400 uppercase mb-1">Interest Saved</p>
                                    <p className="text-3xl font-black text-secondary">₹{prepaymentImpact.savedInterest.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <p className="text-xs text-gray-400 uppercase mb-1">Time Saved</p>
                                    <p className="text-3xl font-black text-primary">{Math.floor(prepaymentImpact.savedMonths / 12)}y {prepaymentImpact.savedMonths % 12}m</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Original Tenure</span>
                                    <span className="font-bold">{tenure} years ({months} months)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">New Tenure</span>
                                    <span className="font-bold text-secondary">{Math.floor(prepaymentImpact.newTenure / 12)}y {prepaymentImpact.newTenure % 12}m</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-gray-400">Original Interest</span>
                                    <span className="font-bold">₹{totalInterest.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">New Interest</span>
                                    <span className="font-bold text-secondary">₹{prepaymentImpact.totalInterest.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border-primary/20 bg-primary/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <ArrowUpCircle size={24} />
                            </div>
                            <p className="text-sm">
                                By paying <span className="text-white font-bold">₹{prepaymentAmount.toLocaleString()}</span> {prepaymentType}, you'll save <span className="text-primary font-bold">₹{prepaymentImpact.savedInterest.toLocaleString()}</span> in interest!
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}



            {/* My EMIs Tab */}
            {activeTab === 'myemis' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                >
                    <div className="glass p-8 rounded-[2.5rem] border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-black mb-1">My Saved <span className="text-secondary">EMIs</span></h3>
                                <p className="text-sm text-gray-400">Manage all your loan calculations in one place</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEmiName('');
                                    setEditingEmiId(null);
                                    setShowSaveModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-all"
                            >
                                <Save size={18} />
                                Add New EMI
                            </button>
                        </div>

                        {savedEmis.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Save size={32} className="text-gray-500" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">No Saved EMIs Yet</h4>
                                <p className="text-gray-400 mb-6">Start by calculating an EMI and save it for future reference</p>
                                <button
                                    onClick={() => setActiveTab('calculator')}
                                    className="px-6 py-3 bg-primary text-background font-bold rounded-xl hover:scale-105 transition-all"
                                >
                                    Go to Calculator
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedEmis.map((emi) => {
                                    const emiCalc = {
                                        monthlyRate: emi.rate / 12 / 100,
                                        months: emi.tenure * 12
                                    };
                                    emiCalc.emi = Math.round(
                                        (emi.amount * emiCalc.monthlyRate * Math.pow(1 + emiCalc.monthlyRate, emiCalc.months)) /
                                        (Math.pow(1 + emiCalc.monthlyRate, emiCalc.months) - 1)
                                    );

                                    return (
                                        <div
                                            key={emi.id}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-lg font-black truncate flex-1">{emi.name}</h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => editEmi(emi)}
                                                        className="p-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all"
                                                        title="Edit EMI"
                                                    >
                                                        <Info size={16} className="text-primary" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEmi(emi.id)}
                                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                                                        title="Delete EMI"
                                                    >
                                                        <X size={16} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3 text-sm mb-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Loan Amount</span>
                                                    <span className="font-bold">₹{emi.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Interest Rate</span>
                                                    <span className="font-bold">{emi.rate}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tenure</span>
                                                    <span className="font-bold">{emi.tenure} years</span>
                                                </div>
                                                <div className="h-px bg-white/10 my-2"></div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 font-bold">Monthly EMI</span>
                                                    <span className="font-black text-primary text-lg">₹{emiCalc.emi.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => loadEmi(emi)}
                                                    className="flex-1 py-3 bg-secondary/10 border border-secondary/20 text-secondary font-bold rounded-xl hover:bg-secondary/20 transition-all"
                                                >
                                                    Load & Calculate
                                                </button>
                                                <button
                                                    onClick={() => deleteEmi(emi.id)}
                                                    className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-3 text-center">
                                                Updated: {new Date(emi.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Savings Tips Modal */}
            <AnimatePresence>
                {showTips && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass max-w-md w-full p-8 rounded-[2rem] border-primary/20 bg-surface relative"
                        >
                            <button
                                onClick={() => setShowTips(false)}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                    <IndianRupee size={32} />

                                </div>
                                <h3 className="text-2xl font-black">Smart Savings Tips</h3>
                                <p className="text-gray-400 text-sm">Reduce your EMI burden with these hacks.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <h4 className="font-bold text-secondary mb-1 text-sm">1. Prepayment Power</h4>
                                    <p className="text-xs text-gray-400">Paying just one extra EMI every year can reduce your tenure by up to 3 years.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <h4 className="font-bold text-primary mb-1 text-sm">2. Step-Up EMI</h4>
                                    <p className="text-xs text-gray-400">Increase your EMI by 5-10% every year as your income grows to close the loan faster.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <h4 className="font-bold text-white mb-1 text-sm">3. Round-Up Logic</h4>
                                    <p className="text-xs text-gray-400">If your EMI is ₹13,215, round it up to ₹14,000. Small difference, huge impact.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTips(false)}
                                className="w-full mt-6 py-3 bg-white/10 hover:bg-white/15 font-bold rounded-xl text-sm transition-all"
                            >
                                Got it, thanks!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Modal */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass max-w-lg w-full p-8 rounded-[2rem] border-indigo-500/20 bg-surface relative"
                        >
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>

                            <button
                                onClick={() => setShowAI(false)}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8 relative z-10">
                                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                                    <Brain size={32} />

                                </div>
                                <h3 className="text-2xl font-black">AI Loan Analysis</h3>
                                <p className="text-gray-400 text-sm">Gullak Intelligence insights for your ₹{amount.toLocaleString()} loan.</p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 mt-1 text-indigo-400"><Info size={16} /></div>
                                        <div>
                                            <h4 className="font-bold text-indigo-200 text-sm mb-1">Interest to Principal Ratio</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                At {rate}%, you are paying <span className="text-white font-bold">₹{(totalInterest / amount * 100).toFixed(0)}</span> in interest for every ₹100 borrowed. Recommend trying to negotiate rates closer to 8.5% if your CIBIL &gt; 750.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 mt-1 text-indigo-400"><Zap size={16} /></div>
                                        <div>
                                            <h4 className="font-bold text-indigo-200 text-sm mb-1">Tenure Optimization</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                Reducing tenure from {tenure} to {Math.max(1, tenure - 5)} years would increase EMI to roughly ₹{Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, (tenure - 5) * 12)) / (Math.pow(1 + monthlyRate, (tenure - 5) * 12) - 1)).toLocaleString()} but save you significantly on interest.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowAI(false)}
                                className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                            >
                                Apply Recommendations
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Save EMI Modal */}
            <AnimatePresence>
                {showSaveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass max-w-md w-full p-8 rounded-[2rem] border-secondary/20 bg-surface relative"
                        >
                            <button
                                onClick={() => {
                                    setShowSaveModal(false);
                                    setEmiName('');
                                    setEditingEmiId(null);
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6 relative z-10">
                                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
                                    <Save size={32} />
                                </div>
                                <h3 className="text-2xl font-black">{editingEmiId ? 'Update' : 'Save'} EMI Configuration</h3>
                                <p className="text-gray-400 text-sm">Give this EMI a name to save it</p>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">
                                        EMI Name
                                    </label>
                                    <input
                                        type="text"
                                        value={emiName}
                                        onChange={(e) => setEmiName(e.target.value)}
                                        placeholder="e.g., Home Loan - Mumbai, Car Loan 2024"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all"
                                        autoFocus
                                        onKeyPress={(e) => e.key === 'Enter' && saveEmiToList()}
                                    />
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Loan Amount:</span>
                                        <span className="font-bold">₹{amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Interest Rate:</span>
                                        <span className="font-bold">{rate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tenure:</span>
                                        <span className="font-bold">{tenure} years</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold">Monthly EMI:</span>
                                        <span className="font-black text-primary text-lg">₹{emi.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowSaveModal(false);
                                            setEmiName('');
                                            setEditingEmiId(null);
                                        }}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 font-bold rounded-xl text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEmiToList}
                                        className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-background font-bold rounded-xl text-sm transition-all shadow-lg"
                                    >
                                        {editingEmiId ? 'Update' : 'Save'} EMI
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmiCalculator;