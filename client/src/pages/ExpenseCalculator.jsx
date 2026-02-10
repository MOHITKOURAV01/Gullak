import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Save, Download, Calculator, IndianRupee, PieChart, TrendingDown, Target, HelpCircle, X, ChevronDown, ChevronRight, RefreshCw, Brain, Sparkles, AlertCircle, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ExpenseCalculator = () => {
    const INITIAL_CATEGORIES = [
        { id: '1', name: 'Home Rent / EMI', amount: 15000, category: 'Fixed', notes: 'Essential' },
        { id: '2', name: 'Groceries', amount: 5000, category: 'Variable', notes: 'Monthly supplies' },
        { id: '3', name: 'Electricity & Water', amount: 2000, category: 'Fixed', notes: '' },
        { id: '4', name: 'Internet & Mobile', amount: 1200, category: 'Fixed', notes: '' },
        { id: '5', name: 'Fuel & Transport', amount: 3500, category: 'Variable', notes: '' },
        { id: '6', name: 'Insurance Premiums', amount: 1500, category: 'Fixed', notes: '' },
    ];

    // State initialization with localStorage check
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('gullak_expenses');
        return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    });

    const [income, setIncome] = useState(() => {
        const saved = localStorage.getItem('gullak_income');
        return saved ? Number(saved) : 50000;
    });

    const [showAI, setShowAI] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const contentRef = useRef(null);

    // Get User ID from LocalStorage
    const getUser = () => {
        try {
            const userStr = localStorage.getItem('gullak_user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    };

    // Auto-save effect
    useEffect(() => {
        localStorage.setItem('gullak_expenses', JSON.stringify(expenses));
        localStorage.setItem('gullak_income', income.toString());

        // Sync to backend
        const syncToBackend = async () => {
            const user = getUser();
            if (!user || !user.id) return; // Don't sync if not logged in

            try {
                await fetch(`${API_URL}/api/expenses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        expenses,
                        income
                    }),
                });
            } catch (error) {
                console.log('Backend sync failed, using localStorage');
            }
        };

        const timeoutId = setTimeout(syncToBackend, 2000); // Debounce
        return () => clearTimeout(timeoutId);
    }, [expenses, income]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const user = getUser();
            if (!user || !user.id) return; // Don't fetch if not logged in

            try {
                const res = await fetch(`${API_URL}/api/expenses?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Only update if backend has data (might be empty for new user)
                    if (data && (data.expenses || data.income)) {
                        setExpenses(data.expenses || []); // Fallback to empty if undefined
                        setIncome(data.income || 50000);
                    }
                }
            } catch (error) {
                console.log('Failed to fetch from backend, using localStorage');
            }
        };
        fetchExpenses();
    }, []);

    const totalExpenses = useMemo(() =>
        expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
        , [expenses]);

    const savings = income - totalExpenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Chart Data Preparation
    const chartData = useMemo(() => {
        const categories = { Fixed: 0, Variable: 0, Luxury: 0 };
        expenses.forEach(e => {
            if (e.category && expenses) {
                categories[e.category] = (categories[e.category] || 0) + (Number(e.amount) || 0);
            }
        });
        return Object.keys(categories).map(key => ({
            name: key,
            value: categories[key]
        })).filter(item => item.value > 0);
    }, [expenses]);

    const CHART_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Primary (Fixed), Orange (Variable), Red (Luxury)

    const aiInsights = useMemo(() => {
        const insights = [];
        const luxuryExpenses = expenses.filter(e => e.category === 'Luxury' && Number(e.amount) > 0);
        const variableExpenses = expenses.filter(e => e.category === 'Variable' && Number(e.amount) > 0);

        const luxuryTotal = luxuryExpenses.reduce((a, b) => a + Number(b.amount), 0);

        // 1. Target the absolute biggest Luxury item
        if (luxuryExpenses.length > 0) {
            const topLuxury = [...luxuryExpenses].sort((a, b) => b.amount - a.amount)[0];
            if (topLuxury.amount > (income * 0.05)) {
                insights.push({
                    type: 'warning',
                    text: `Your spending on "${topLuxury.name}" (₹${topLuxury.amount.toLocaleString()}) is quite high. Reducing this by 30% could save you ₹${Math.round(topLuxury.amount * 0.3 * 12).toLocaleString()} annually.`
                });
            }
        }

        // 2. Identify "Money Leaks" in Variable expenses
        const leakThreshold = income * 0.08;
        variableExpenses.forEach(exp => {
            if (exp.amount > leakThreshold) {
                insights.push({
                    type: 'info',
                    text: `"${exp.name}" might be a 'Money Leak'. Can you find cheaper alternatives? A 20% saving (~₹${Math.round(exp.amount * 0.2).toLocaleString()}) is achievable.`
                });
            }
        });

        // 3. General savings target
        if (savingsRate < 25) {
            insights.push({
                type: 'urgent',
                text: `Your Savings Rate (${Math.round(savingsRate)}%) is below the ideal 25%. Consider cutting down on non-essential subscriptions or dining out.`
            });
        }

        // 4. Specific Category Advice
        if (luxuryTotal > (income * 0.15)) {
            insights.push({
                type: 'warning',
                text: "Luxury expenses are hindering your wealth creation. Try a 'No-Buy' challenge for the next 2 months."
            });
        }

        return insights;
    }, [expenses, income, savingsRate]);

    const addRow = (category = 'Variable') => {
        const newId = Math.random().toString(36).substr(2, 9);
        setExpenses([
            ...expenses,
            { id: newId, name: '', amount: 0, category: category, notes: '' }
        ]);
    };

    const removeRow = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const updateRow = (id, field, value) => {
        setExpenses(expenses.map(e => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const resetSheet = () => {
        if (window.confirm('Reset all values to default? This cannot be undone.')) {
            setExpenses(INITIAL_CATEGORIES);
            setIncome(50000);
            localStorage.removeItem('gullak_expenses');
            localStorage.removeItem('gullak_income');
        }
    };

    // New Function: Import EMI from Saved Data
    const importEMI = () => {
        const savedEmisCheck = localStorage.getItem('gullak_saved_emis');
        if (savedEmisCheck) {
            const parsedEmis = JSON.parse(savedEmisCheck);

            // Calculate total monthly EMI from all saved loans
            const totalMonthlyEMI = parsedEmis.reduce((acc, loan) => {
                const monthlyRate = loan.rate / 12 / 100;
                const months = loan.tenure * 12;
                const emi = Math.round((loan.amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
                return acc + emi;
            }, 0);

            if (totalMonthlyEMI > 0) {
                if (window.confirm(`Found ${parsedEmis.length} saved loan(s) with a total EMI of ₹${totalMonthlyEMI.toLocaleString()}. Add this to your expenses?`)) {
                    const newId = Math.random().toString(36).substr(2, 9);
                    setExpenses(prev => [
                        { id: newId, name: 'Total Loan EMIs', amount: totalMonthlyEMI, category: 'Fixed', notes: 'Imported from EMI Calculator' },
                        ...prev
                    ]);
                }
            } else {
                alert('No active EMI amounts found in your saved loans.');
            }
        } else {
            alert('No saved EMIs found. Go to the EMI Calculator to save your loans first.');
        }
    };

    // New Function: Export as PDF
    const exportPDF = async () => {
        if (!contentRef.current) return;
        setIsExporting(true);
        try {
            const element = contentRef.current;

            // Standardizing canvas capture
            const canvas = await html2canvas(element, {
                scale: 1.5, // 1.5 is safer for memory than 2.0
                backgroundColor: '#0a0a0a',
                useCORS: true,
                logging: false,
                onclone: (clonedDoc) => {
                    // Hide UI-only elements in the PDF
                    const buttons = clonedDoc.querySelectorAll('button');
                    buttons.forEach(btn => btn.style.display = 'none');
                    const noPrint = clonedDoc.querySelectorAll('#no-print');
                    noPrint.forEach(el => el.style.display = 'none');

                    // FIX: Force standard colors to avoid "oklab" errors in html2canvas (Tailwind 4 issue)
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        :root {
                            --color-background: #0A0A0A !important;
                            --color-surface: #171717 !important;
                            --color-primary: #FFD700 !important;
                            --color-secondary: #10B981 !important;
                        }
                        /* Fallback for Tailwind 4 gray shades */
                        .text-gray-200 { color: #e5e7eb !important; }
                        .text-gray-300 { color: #d1d5db !important; }
                        .text-gray-400 { color: #9ca3af !important; }
                        .text-gray-500 { color: #6b7280 !important; }
                        .text-gray-600 { color: #4b5563 !important; }
                        
                        /* Fix gradients which html2canvas sometimes chokes on with background-clip: text */
                        .text-gradient {
                            background: none !important;
                            -webkit-text-fill-color: #FFD700 !important;
                            color: #FFD700 !important;
                        }
                        
                        /* Remove animations that might mess up capture */
                        * { 
                            animation: none !important; 
                            transition: none !important; 
                        }
                    `;
                    clonedDoc.head.appendChild(style);

                    // Ensure full visibility
                    const container = clonedDoc.querySelector('.max-w-7xl');
                    if (container) container.style.padding = '20px';
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Handle multi-page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Gullak_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('PDF Generation Crash:', error);
            alert('PDF Export Error: ' + (error.message || 'Check console for details'));
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="pt-28 pb-16 min-h-screen bg-background text-white" ref={contentRef}>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 tracking-widest uppercase">
                            <Calculator size={14} />
                            <span>Financial Planning</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                            Monthly <span className="text-gradient">Expense Planner</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            A precision spreadsheet tool for the modern Indian household.
                            Track, optimize, and master your cash flow.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap gap-4" id="no-print">
                        <Link
                            to="/debt-optimizer"
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <TrendingDown size={20} />
                            Debt Optimizer
                        </Link>
                        <button
                            onClick={importEMI}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white hover:text-primary tooltip"
                            title="Import Saved EMIs"
                        >
                            <Upload size={20} />
                        </button>
                        <button
                            onClick={resetSheet}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
                            title="Reset Sheet"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={exportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Download size={20} />
                            )}
                            {isExporting ? 'Generating...' : 'Export PDF'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Column: The Spreadsheet */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Income Setting Card */}
                        <div className="glass p-6 rounded-3xl border-primary/20 bg-primary/5">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block font-mono">Monthly Take-Home Income</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
                                        <input
                                            type="number"
                                            value={income}
                                            onChange={(e) => setIncome(Number(e.target.value))}
                                            className="w-full bg-background/50 border-2 border-primary/20 rounded-2xl pl-12 pr-6 py-4 text-3xl font-black text-white focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-16 bg-white/10" />
                                <div className="text-center md:text-left">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Savings Potential</p>
                                    <h2 className={`text-4xl font-black ${savings >= 0 ? 'text-secondary' : 'text-red-500 underline decoration-wavy decoration-red-500/50'}`}>
                                        ₹{savings.toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Expense Table */}
                        <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
                            {/* Spreadsheet Header */}
                            <div className="grid grid-cols-12 gap-4 p-5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/10">
                                <div className="col-span-1 flex items-center justify-center">#</div>
                                <div className="col-span-11 md:col-span-5">Expense Description</div>
                                <div className="col-span-6 md:col-span-3 text-center">Amount (₹)</div>
                                <div className="col-span-4 md:col-span-2 text-center">Category</div>
                                <div className="col-span-2 md:col-span-1 text-right">Delete</div>
                            </div>

                            {/* Spreadsheet Rows */}
                            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence initial={false}>
                                    {expenses.map((expense, index) => (
                                        <motion.div
                                            key={expense.id}
                                            layout
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] group transition-all"
                                        >
                                            <div className="col-span-1 flex items-center justify-center text-xs font-mono text-gray-600">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div className="col-span-11 md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={expense.name}
                                                    onChange={(e) => updateRow(expense.id, 'name', e.target.value)}
                                                    placeholder="Specify expense..."
                                                    className="w-full bg-transparent border-none focus:ring-0 text-white font-medium placeholder:text-white/10"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-3 relative">
                                                <input
                                                    type="number"
                                                    value={expense.amount === 0 ? '' : expense.amount}
                                                    onChange={(e) => updateRow(expense.id, 'amount', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center font-bold text-white focus:bg-white/10 focus:border-primary/50 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2">
                                                <select
                                                    value={expense.category}
                                                    onChange={(e) => updateRow(expense.id, 'category', e.target.value)}
                                                    className={`w-full bg-transparent text-xs font-bold outline-none cursor-pointer ${expense.category === 'Fixed' ? 'text-primary' :
                                                        expense.category === 'Variable' ? 'text-orange-400' : 'text-red-400'
                                                        }`}
                                                >
                                                    <option value="Fixed">FIXED</option>
                                                    <option value="Variable">VARIABLE</option>
                                                    <option value="Luxury">LUXURY</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2 md:col-span-1 flex justify-end">
                                                <button
                                                    onClick={() => removeRow(expense.id)}
                                                    className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Spreadsheet Footer */}
                            <div className="p-6 bg-white/[0.03] border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6" id="no-print">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => addRow()}
                                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Plus size={16} />
                                        </div>
                                        Add New Item
                                    </button>
                                    <button
                                        onClick={() => setShowAI(!showAI)}
                                        className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-primary transition-colors group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                            <Brain size={16} className={showAI ? 'text-primary' : ''} />
                                        </div>
                                        Analyze with AI Munshi
                                    </button>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Grand Total</span>
                                    <div className="text-3xl font-black text-white">
                                        ₹{totalExpenses.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* AI Insights Section */}
                            <AnimatePresence>
                                {showAI && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-primary/5 border-t border-primary/10 overflow-hidden"
                                    >
                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/20">
                                                        <Sparkles className="text-primary" size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">AI Munshi's Counsel</h4>
                                                        <p className="text-gray-400 text-[10px] font-bold">Analysis based on your current cash flow</p>
                                                    </div>
                                                </div>

                                                {aiInsights.length > 0 && (
                                                    <div className="bg-background/40 backdrop-blur-md px-4 py-2 rounded-xl border border-primary/20">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Potential Monthly Savings</span>
                                                        <span className="text-xl font-black text-secondary">
                                                            ₹{Math.round(expenses.filter(e => e.category !== 'Fixed').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) * 0.2).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className={`p-5 rounded-2xl border flex gap-4 transition-all hover:scale-[1.02] ${insight.type === 'warning' ? 'bg-red-500/5 border-red-500/20' :
                                                            insight.type === 'urgent' ? 'bg-orange-500/5 border-orange-500/20' :
                                                                'bg-blue-500/5 border-blue-500/20'
                                                            }`}
                                                    >
                                                        <div className={`mt-1 shrink-0 ${insight.type === 'warning' ? 'text-red-400' :
                                                            insight.type === 'urgent' ? 'text-orange-400' :
                                                                'text-blue-400'
                                                            }`}>
                                                            {insight.type === 'warning' ? <TrendingDown size={20} /> : <AlertCircle size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-200 leading-relaxed font-medium">{insight.text}</p>
                                                            <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
                                                                Execute this cut <ChevronRight size={12} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )) : (
                                                    <div className="col-span-2 text-center py-8">
                                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Brain className="text-gray-600" size={32} />
                                                        </div>
                                                        <p className="text-gray-400 font-medium italic">"Add your expenses, and I'll show you where you can save money."</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Insights & Summary */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Distribution Donut Chart (NEW) */}
                        <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col items-center">
                            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2 w-full text-left">Spending Distribution</h3>
                            <div className="w-full h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
                                    <span className="text-[10px] text-gray-500 uppercase font-black">Total</span>
                                    <div className="text-lg font-black text-white">₹{(totalExpenses / 1000).toFixed(1)}k</div>
                                </div>
                            </div>
                        </div>

                        {/* Savings Rate Card */}
                        <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <PieChart size={120} />
                            </div>
                            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-6">Savings Rate</h3>
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        fill="transparent"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        fill="transparent"
                                        stroke="var(--color-secondary)"
                                        strokeWidth="8"
                                        strokeDasharray={364.4}
                                        strokeDashoffset={364.4 - (364.4 * Math.min(Math.max(savingsRate, 0), 100)) / 100}
                                        className="transition-all duration-1000 ease-out"
                                        style={{ stroke: 'var(--color-primary)' }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-black">{Math.round(savingsRate)}%</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {savingsRate >= 30
                                    ? "Excellent! You're following the 50/30/20 rule perfectly."
                                    : savingsRate >= 10
                                        ? "Good progress. Try to push your savings to 20% by reducing variable costs."
                                        : "Warning: Your savings are below recommended levels. Review luxury expenses."
                                }
                            </p>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="glass p-6 rounded-3xl border-white/5 hover:bg-white/[0.03] transition-colors">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Target size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Emergency Fund Target</span>
                                </div>
                                <h4 className="text-2xl font-black">₹{(totalExpenses * 6).toLocaleString()}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">6 months of runway</p>
                            </div>

                            <div className="glass p-6 rounded-3xl border-white/5 hover:bg-white/[0.03] transition-colors">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                                        <TrendingDown size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fixed Cost Ratio</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <h4 className={`text-3xl font-black ${(expenses.filter(e => e.category === 'Fixed').reduce((a, b) => a + (Number(b.amount) || 0), 0) / totalExpenses) * 100 > 50
                                            ? 'text-red-500' : 'text-white'
                                            }`}>
                                            {Math.round((expenses.filter(e => e.category === 'Fixed').reduce((a, b) => a + (Number(b.amount) || 0), 0) / totalExpenses) * 100 || 0)}%
                                        </h4>
                                        <span className="text-[10px] font-bold text-gray-400">TARGET: &lt;50%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${(expenses.filter(e => e.category === 'Fixed').reduce((a, b) => a + (Number(b.amount) || 0), 0) / totalExpenses) * 100 > 50
                                                ? 'bg-red-500' : 'bg-orange-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((expenses.filter(e => e.category === 'Fixed').reduce((a, b) => a + (Number(b.amount) || 0), 0) / totalExpenses) * 100 || 0, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Recommended is under 50% for financial agility.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="glass p-6 rounded-3xl border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <HelpCircle size={18} />
                                <span className="text-sm font-bold">Pro Tip</span>
                            </div>
                            <p className="text-sm text-gray-300 italic">
                                "Track your variable expenses for 3 months to identify patterns.
                                Most people overspend on Dining & OTT subscriptions without realizing."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 215, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 215, 0, 0.3);
                }
                select option {
                    background-color: #0F0F0F;
                    color: white;
                }
            `}} />
        </div>
    );
};

export default ExpenseCalculator;
