import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Sparkles,
    ShieldCheck,
    Zap,
    Award,
    CreditCard,
    Globe,
    ArrowRight,
    CheckCircle2,
    Info,
    Gift,
    Wallet
} from 'lucide-react';

const CardDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);

    // This would typically come from an API or a shared data file
    const cardsData = [
        {
            id: 1,
            name: "HDFC Millennia",
            type: "Credit Card",
            color: "from-blue-600 to-indigo-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "5% Cashback on Amazon, Flipkart, Myntra",
                "1% Cashback on all other spends",
                "8 Domestic Lounge accesses per year",
                "Dining discount up to 20% via Swiggy Dineout"
            ],
            detailedBenefits: [
                { title: "Cashback Mastery", desc: "Enjoy 5% CashBack on Amazon, BookMyShow, Cult.fit, Flipkart, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber and Zomato" },
                { title: "Lounge Access", desc: "8 Complimentary Domestic Airport Lounge access annually (2 per quarter)" },
                { title: "Milestone Rewards", desc: "₹1,000 worth gift vouchers on spends of ₹1,00,000 and above in each calendar quarter" },
                { title: "Fuel Surcharge Waiver", desc: "1% fuel surcharge waiver at all fuel stations across India" }
            ],
            bestFor: "Daily Lifestyle & Shopping",
            fee: "₹1,000 (Waived on ₹1L spend)",
            rating: 4.8,
            pros: ["High cashback on popular apps", "Welcome benefit points", "Contactless payment"],
            cons: ["Higher annual fee for low spenders"],
            apr: "3.6% monthly",
            minIncome: "₹35,000 monthly"
        },
        {
            id: 2,
            name: "IDFC First WOW",
            type: "Credit Card",
            color: "from-emerald-600 to-teal-900",
            category: "Students",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "No Income Proof required (FD based)",
                "Zero Forex Markup on International spends",
                "6X Rewards on all spends",
                "Buy 1 Get 1 on Movie Tickets"
            ],
            detailedBenefits: [
                { title: "FD Based Security", desc: "Get credit limit up to 100% of your Fixed Deposit amount" },
                { title: "Forex Advantage", desc: "0% Forex Markup on international spends - best for international travel" },
                { title: "High Interest", desc: "Earn up to 7.5% p.a. interest on your Fixed Deposit" },
                { title: "Complimentary Benefits", desc: "Roadside assistance and personal accident cover included" }
            ],
            bestFor: "Students & First-time Card Users",
            fee: "₹0 (Life Time Free)",
            rating: 4.9,
            pros: ["No annual fee", "No credit check", "High FD interest"],
            cons: ["Requires FD lock-in"],
            apr: "0.75% to 3.5% monthly",
            minIncome: "₹2,000 FD"
        }
    ];

    useEffect(() => {
        const foundCard = cardsData.find(c => c.id === parseInt(id));
        setCard(foundCard);
        window.scrollTo(0, 0);
    }, [id]);

    if (!card) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Card not found</h2>
                    <button
                        onClick={() => navigate('/cards')}
                        className="text-primary flex items-center gap-2 hover:underline"
                    >
                        <ChevronLeft size={20} /> Back to Cards
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-28">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-12 mb-16 items-start">
                    {/* Visual Card Representation */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-1/2"
                    >
                        <div className={`aspect-[1.58/1] w-full max-w-md mx-auto relative rounded-[2.5rem] p-10 overflow-hidden shadow-2xl bg-gradient-to-br ${card.color} group`}>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                            {/* Card Content */}
                            <div className="relative h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{card.bank}</span>
                                        <h2 className="text-3xl font-black tracking-tighter italic uppercase leading-none">{card.name}</h2>
                                    </div>
                                    <div className="w-12 h-10 bg-white/10 rounded-md backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-sm shadow-inner opacity-80"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="flex gap-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold tracking-[0.2em] opacity-80">VALID THRU: 12/29</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Titanium Member</p>
                                        <CreditCard size={32} className="opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-12 w-full max-w-md mx-auto">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Rating</p>
                                <p className="text-xl font-bold text-primary">{card.rating}/5.0</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Fee</p>
                                <p className="text-xl font-bold text-white">{card.fee.split(' ')[0]}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Type</p>
                                <p className="text-xl font-bold text-white">Credit</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card Content Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.25em] border border-primary/20">{card.country}</span>
                                <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] border border-white/10">{card.category}</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">{card.name}</h1>
                            <p className="text-xl text-gray-400 font-medium max-w-xl">Supercharge your spending with {card.bank}'s flagship {card.type}. {card.bestFor}.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest">Eligibility</h4>
                                </div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Minimum Income</p>
                                <p className="text-white font-bold">{card.minIncome}</p>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-secondary/20 transition-all duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Zap size={20} />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest">Pricing</h4>
                                </div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Finance Charges (APR)</p>
                                <p className="text-white font-bold">{card.apr}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-primary text-background px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                                Apply Now <ArrowRight size={20} />
                            </button>
                            <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                                Download Brochure <Gift size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Benefits Deep Dive */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <Award size={32} className="text-primary" />
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Full Rewards Breakdown</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {card.detailedBenefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex gap-6 group hover:bg-white/10 transition-all duration-500"
                            >
                                <div className="mt-1">
                                    <CheckCircle2 size={24} className="text-secondary group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black mb-2 text-white">{benefit.title}</h4>
                                    <p className="text-gray-400 leading-relaxed font-medium">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[3rem]">
                        <h3 className="text-2xl font-black mb-8 text-emerald-400 uppercase italic flex items-center gap-3">
                            <Zap size={24} /> Pros
                        </h3>
                        <ul className="space-y-4">
                            {card.pros.map((pro, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[3rem]">
                        <h3 className="text-2xl font-black mb-8 text-red-400 uppercase italic flex items-center gap-3">
                            <Info size={24} /> Cons
                        </h3>
                        <ul className="space-y-4">
                            {card.cons.map((con, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-primary to-yellow-600 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-background tracking-tighter mb-8 max-w-3xl mx-auto uppercase italic">
                            READY TO OPTIMIZE YOUR SAVINGS WITH {card.name}?
                        </h2>
                        <button className="bg-background text-primary px-16 py-6 rounded-full font-black uppercase tracking-widest text-xl hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto">
                            Apply Today <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetails;
